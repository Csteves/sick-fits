const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {randomBytes} = require('crypto');
const {promisify} = require('util');
const {transport, makeANiceEmail} = require('../mail');
const {hasPermission} = require('../utils');


const mutations = {
    async createItem(parent, args, ctx, info) {
      if(!ctx.request.userId){
          throw new Error("You must be logged in to do that!");
      }
        const item = await ctx.db.mutation.createItem({
            data: {
                //This is how we create a relation between item and user
                user: {
                    connect: {
                        id: ctx.request.userId,
                    },
                },
                ...args
            }
        }, info);
        console.log(item)
        return item;
    },
    updateItem(parent, args, ctx, info) {
        //first take a copy of the updates
        const updates = { ...args };
        //remove the ID from the updates
        delete updates.id;
        // run the update method
        return ctx.db.mutation.updateItem(
            {
                data: updates,
                where: {
                    id: args.id,
                },
            },
            info
        );
    },
    async deleteItem(parent, args, ctx, info) {
        const where = { id: args.id };
        //find the item
        const item = await ctx.db.query.item({ where }, '{id, title}')
        // check if they own that item, or have the permissions
        // delete it
        return ctx.db.mutation.deleteItem({ where }, info)
    },
    async signup(parent, args, ctx, info) {
        // Lower case their email
        args.email = args.email.toLowerCase();
        // Hash and Salt their password
        const password = await bcrypt.hash(args.password, 10);
        //Store user in the Database
        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password,
                permissions: { set: ['USER'] }
            }
        },
            info // whats returned from the createUser mutation
        );
        // create JWT token for user
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        //Set the jwt as a cookie on the response
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
        });
        // Finally return the user to the browser
        return user
    },
    async signIn(parent, { email, password }, ctx, info) {
        //1. check if there is a user with provided email
        const user = await ctx.db.query.user({where: {email}})
        if (!user) {
           throw new Error(`No such user found for email ${email}`)
        }
        //2. Check if their password is correct
        const verified = await bcrypt.compare(password, user.password)
        if (!verified) {
            throw new Error("Invaild password")
        }
        //3. Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
        //4. Set the cookie with the token
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
        });
        //5. Return the user
        return user;
    },
    signOut(parent, args, ctx, info){
        ctx.response.clearCookie('token');
        return {message:"Goodbye!"};
    },
    async requestReset(parent, args, ctx, info){
        //1. Check if the user exists
        const user = await ctx.db.query.user({where:{ email: args.email}})
        if(!user){
            throw new Error(`No such user found for email ${args.email}`)
        }
        //2. Set a reset token and expiry on that user
        const randomBytesPromiseified = promisify(randomBytes);
        const resetToken = (await randomBytesPromiseified(20)).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
        const res = await ctx.db.mutation.updateUser({
           where: {email: args.email},
           data: {resetToken, resetTokenExpiry},
        });
        //3. Email them the reset token
        const mailRes = await transport.sendMail({
            from:'craigstevens044@gmail.com',
            to: user.email,
            subject: 'Your Password Reset Token',
            html: makeANiceEmail(`Your Password Reset Token is here!
            \n\n
            <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">
            Click Here To Reset </a>
            `),
        });

        //4. Return the message
        return {message: 'Thanks'}
    },
    async resetPassword(parent, args, ctx, info){
        //1. Check if the passwords match
        const confirmed = args.password === args.confirmPassword;
        if(!confirmed) throw new Error('Your passwords did not match.');
        //2. Check if its a legit reset token
        const [user] = await ctx.db.query.users(
            {where:
                {
                    resetToken: args.resetToken,
                    resetTokenExpiry_gte: Date.now() - 3600000,
                },}
            );
        //3. Check if its expired
        if(!user){throw new Error('This token is either invalid or expired')};
        //4. Hash thier new Password
        const password = await bcrypt.hash(args.password, 10);
        //5. Save the new password to the user and remove old resetToken fields
        const updatedUser = await ctx.db.mutation.updateUser({
            where:{email: user.email},
            data:{
                password,
                resetToken:null,
                resetTokenExpiry:null
            }
        })
        //6. Generate JWT token
        const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
        //7. Set the cookie with the token
        ctx.response.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
        });
        //8. Return the new user
        return updatedUser
    },
    async updatePermissions(parent,args,ctx,info){
        if(!ctx.request.userId){
            throw new Error("Must be logged in to do this1")
        }
        const user = await ctx.db.query.user({
            where:{id:ctx.request.userId},
        },
         info
        );
        hasPermission(user, ['ADMIN','PERMISSIONUPDATE']);
        const updatedUser = ctx.db.mutation.updateUser({
            data:{
                permissions:{
                    set: args.permissions,
                },
            },
            where:{
                id: args.userId
            },
        },
        info
        );
        return updatedUser;
    }
};

module.exports = mutations;
