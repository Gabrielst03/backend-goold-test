import User from "../models/User.js";


export async function createUser(req, res) {

    const { name, email, address, password } = req.body;

    const alreadyExists = await User.findOne({ where: { email } });

    if (alreadyExists) {
        return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({
        name,
        email,
        address,
        password
    });

    return res.status(201).json(user);
}

export async function getUsers(req, res) {
    const users = await User.findAll();
    return res.status(200).json(users);
}

export async function getUserById(req, res) {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
}

export async function updateUser(req, res) {
    const { id } = req.params;
    const { name, email, address, password } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    await user.update({ name, email, address, password });
    return res.status(200).json(user);
}