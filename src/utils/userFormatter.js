export function formatUserResponse(user) {
    const userObject = user.toJSON ? user.toJSON() : user;

    return {
        id: userObject.id,
        firstName: userObject.firstName,
        lastName: userObject.lastName,
        email: userObject.email,
        accountType: userObject.accountType,
        address: formatAddress(userObject.address),
        createdAt: userObject.createdAt,
        updatedAt: userObject.updatedAt
    };
}

function formatAddress(address) {
    if (!address) {
        return null;
    }

    if (typeof address === 'object') {
        return address;
    }

    if (typeof address === 'string') {
        try {
            return JSON.parse(address);
        } catch (error) {
            console.warn('Erro ao fazer parse do address:', error);
            return address;
        }
    }

    return address;
}
