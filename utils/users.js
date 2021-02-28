const users = [];

// Join user to Chat

function userJoin(id, username, group) {
    const user = {
        id,
        username,
        group
    };

    users.push(user);

    return user;

}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User leave's chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get group users 
function getGroupUsers(group) {
    return users.filter(user => user.group === group);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getGroupUsers
}