const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: { type: String, unique: true,  required: true, trim: true},
        // email: { type: String, required: true, unique: true, }, still need validator
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought',
            }
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            }
        ]
    },
    {
    toJSON: {
        virtuals: true,
    },
    id: false,
    }
);

// virtual property `friendCount` that retrieves the length of the user's friends on query
userSchema
    .virtual('friendCount')
    .get(function () {
        return `Friend Count = ${this.friends.length}`
    });

const User = model('user', userSchema);

module.exports = User;
