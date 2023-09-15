const { Schema, model, Types } = require('mongoose');

const reactionSchema = new Schema({
    reactionID: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    reactionBody: { type: String, required: true, maxLength: 280},
    username: { type: String, required: true},
    createdAt: { type: Date, default: Date.now,  get: (date) => date.toLocaleDateString() }
},
{
    toJSON: {
        getters: true,
    },
    id: false,
}
);

const thoughtSchema = new Schema(
    {
        thoughtText: { type: String, required: true, minLength: 1, maxLength: 280 },
        createdAt: {type: Date, default: Date.now, get: (date) => date.toLocaleDateString() },
        username: { type: String, required: true},
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);


// virtual property `reactionCount` that retrieves the length of the reactions on each thought on query
thoughtSchema
    .virtual('reactionCount')
    .get(function () {
        return this.reactions.length
    });

const Thought = model('thought', thoughtSchema);


module.exports = Thought;
