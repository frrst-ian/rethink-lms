const prisma = require("../lib/prisma");

async function createUser(name, email, password, role, bio, profilePicture) {
    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: password,
            role: role,
            bio: bio,
            profilePicture: profilePicture,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePicture: true,
        },
    });

    return user;
}

async function getUserByEmail(email) {
    return await prisma.user.findUnique({
        where: { email },
    });
}

async function getUserById() {}

module.exports = { createUser, getUserByEmail, getUserById };
