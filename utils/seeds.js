const connection = require('../config/connection');
const { User, Thought } = require('../models');
const { user, thoughts, reactions } = require('./data');

connection.on('error', (err) => err);

const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

connection.once('open', async () => {
    console.log('connected');
    // Delete the collections if they exist
    await User.deleteMany();
    await Thought.deleteMany();
    let userData = await User.insertMany(user)
    console.log(userData);
    for (let i = 0; i < thoughts.length; i++) {
        const element = thoughts[i];
        let myUser = getRandomArrItem(userData)
        element.username = myUser.username
        const thoughtData = await Thought.create(element)
        console.log(thoughtData);
        await User.findOneAndUpdate(
            {_id: myUser._id},
            {$addToSet: {thoughts: thoughtData._id}},
            {new: true}
        )
        await Thought.findOneAndUpdate(
            {_id: thoughtData._id},
            {$addToSet: {reactions: reactions[i]}},
            {new: true}
        )    
   }
   console.log('database complete');
   process.exit(0);
})

