const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const mutations = {
    async    createItem(parent,args,ctx,info){
        //TODO Check if user is logged in
        const item = await ctx.db.mutation.createItem({
            data:{
                ...args
            }
        }, info);
        console.log(item)
        return item;
    },
    updateItem(parent,args,ctx,info){
        //first take a copy of the updates
        const updates = {...args};
        //remove the ID from the updates
        delete updates.id;
        // run the update method
        return ctx.db.mutation.updateItem(
            {
                data:updates,
                where: {
                    id: args.id,
                },
            },
            info
        );
    },
    async deleteItem(parent,args,ctx,info){
        const where = {id:args.id};
        //find the item
        const item = await ctx.db.query.item({where},'{id, title}')
        // check if they own that item, or have the permissions
        // delete it
        return ctx.db.mutation.deleteItem({where},info)
    },
    async signup(parent,args,ctx,info){
        // Lower case their email
        args.email = args.email.toLowerCase();
        // Hash and Salt their password
        const password = await bcrypt.hash(args.password, 10);
        //Store user in the Database
        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password,
                permissions: {set: ['USER']}
            }
        },
        info // whats returned from the createUser mutation
        );
        // create JWT token for user
        const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);
        //Set the jwt as a cookie on the response
        ctx.response.cookie('token',token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
        });
        // Finally return the user to the browser
        return user
    }
};

module.exports = mutations;
