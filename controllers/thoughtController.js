const { User, Thought } = require('../models');

module.exports = {
    // get all thoughts
    async getThoughts(req, res){
        try {
            const thought = await Thought.find();
            res.json(thought)
        } catch (error) {
            res.status(500).json(error);
        }
    },
    // get a single thought by id
    async getSingleThought(req, res){
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId})
                .select('-__v');
            if(!thought){
                return res.status(404).json({ message: 'No thought with this ID found'})
            }

            res.json(thought);

        } catch (error) {
            res.status(500).json(error);
        }
    },
    // create a new thought
    // DOUBLE CHECK CODE
    async createThought(req,res){
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                {username: req.body.username},
                {$addToSet: { thoughts: thought._id}},
                {new: true}
            );

            if(!user) {
                return res.status(404).json({message: 'Thought created, but found no user with that ID!'})
            }

            res.json('Thought created!');
        } catch (error) {
            res.status(500).json(error);
        }
    },
    // update thought by id
    async updateThought(req, res){
        try{
        const thought = await Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        );

        if(!thought) {
            return res.status(404).json({ message: 'No thought with this ID'})
        }

        res.json(thought);
        } catch (err) {
        res.status(500).json(err);
        }
    },
    // delete thought by id
    async deleteThought(req, res) {
        try {
          const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });
    
          if (!thought) {
            return res.status(404).json({ message: 'No thought with this id!' });
          }
    
          const user = await User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
          );
    
          if (!user) {
            return res.status(404).json({
              message: 'Thought deleted but no user with this id!',
            });
          }
    
          res.json({ message: 'Thought successfully deleted!' });
        } catch (err) {
          res.status(500).json(err);
        }
      },
    // add a reaction to thought
    async addReaction(req, res){
        try {
            const thought  = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                {$addToSet: { reactions: req.body}},
                {runValidators:true, new: true}
            );
            
            if(!thought){
                return res.status(404).json({message: 'No Thought found with that ID!'})
            }
            res.json(thought);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    // Remove reaction from a thought
  async deleteReaction(req, res) {
    console.log("Cool beans");
    console.log(req.params);
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId} } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No thought found with that ID!' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  }
}