const { Schema, model } = require('mongoose');

const thoughtSchema = new Schema(
    {
        thoughtText: { type: String, required: true, minLength: 1, maxLength: 280 },
        // createdAt: {type: Date, default: Date.now }, need getter method
        username: { type: String, required: true},
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

const reactionSchema = new mongoose.Schema({
    reactionID: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId,
    },
    reactionBody: { type: String, required: true, maxLength: 280},
    username: { type: String, required: true},
    createdAt: { type: Date, default: Date.now, }
})

// virtual property `reactionCount` that retrieves the length of the reactions on each thought on query
thoughtSchema
    .virtual('reactionCount')
    .get(function () {
        return `Reactions: ${this.reactions.length}`
    });

const Thought = model('thought', thoughtSchema);
const Reaction = model('thought', reactionSchema);

module.exports = { Thought, Reaction };
