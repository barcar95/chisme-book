const { User, Thought } = require('../models');

module.exports = {
    // get all users
    async getUsers(req, res){
        try {
            const users = await User.find();
            res.json(users)
        } catch (error) {
            res.status(500).json(error);
        }
    },
    // get a single user by id
    async getSingleUser(req, res){
        try {
            const user = await User.findOne({ _id: req.params.userId})
                .select('-__v');
            if(!user){
                return res.status(404).json({ message: 'No user with this ID found'})
            }

            res.json(user);

        } catch (error) {
            res.status(500).json(error);
        }
    },
    // create a new user
    async createUser(req,res){
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    // update user by id
    async updateUser(req, res){
        try{
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if(!user) {
            return res.status(404).json({ message: 'No user with this ID'})
        }

        res.json(user);
        } catch (err) {
        res.status(500).json(err);
        }
    },
    // delete user by id
    async deleteUser(req, res){
        try {
            const user = await User.findOneAndDelete({_id: req.params.userId});

            if(!user){
                return res.status(404).json({message: 'No user with that ID'})
            }
            // deleting user's associated thoughts when deleted
            await Thought.deleteMany({_id: {$in: user.thoughts}});
            res.json({message: 'User and associated thoughts deleted!'})
        } catch (error) {
            res.status(500).json(error);
        }
    },
    // add a friend to user
    async addFriend(req, res){
        try {
            const user  = await User.findOneAndUpdate(
                {_id: req.params.userId},
                {$addToSet: { friends: req.params.friendId}},
                {runValidators:true, new: true}
            );
            
            if(!user){
                return res.status(404).json({message: 'No user found with that ID!'})
            }
            res.json(user);
        } catch (error) {
            res.status(500).json(error);
            console.log(error);
        }
    },
    // Remove friend from a user
  async deleteFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends:req.params.friendsId } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ message: 'No user found with that ID!' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}