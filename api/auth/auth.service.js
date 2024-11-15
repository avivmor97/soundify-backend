import { userService } from '../user/user.service.js';
import { logger } from '../../services/logger.service.js';

export const authService = {
    signup,
    login,
    getLoginToken,
    validateToken,
};

async function login(username, password) {
    logger.debug('authService.login - Start login process');
    
    // Log received credentials (excluding password for security)
    console.log(`[LOGIN ATTEMPT] Username: ${username}`);

    // Fetch the user by username
    const user = await userService.getByUsername(username);
    if (!user) {
        console.error(`[LOGIN FAILURE] Username: ${username} not found`);
        logger.warn(`authService.login - Failed login: username "${username}" not found`);
        return Promise.reject('Invalid username or password');
    }
    console.log(`[USER FOUND] Username: ${username}`);

    // Compare the provided password with the stored password (plain text)
    if (user.password !== password) {
        console.error(`[LOGIN FAILURE] Incorrect password for username: ${username}`);
        logger.warn(`authService.login - Failed login: invalid password for username "${username}"`);
        return Promise.reject('Invalid username or password');
    }
    console.log(`[PASSWORD VERIFIED] Username: ${username}`);

    // Remove sensitive information
    delete user.password;
    user._id = user._id.toString();

    // Generate login token
    const token = getLoginToken(user);
    console.log(`[TOKEN GENERATED] For username: ${username}`);
    logger.info(`authService.login - Successful login for username "${username}"`);

    return { user, token };
}

async function signup({ username, password, imgUrl }) {
    logger.debug(`auth.service - signup with username: ${username}`);

    if (!username || !password) return Promise.reject('Missing required signup information');

    const userExist = await userService.getByUsername(username);
    if (userExist) return Promise.reject('Username already taken');

    // Store the password as plain text
    return userService.add({ username, password, imgUrl });
}

function getLoginToken(user) {
    const userInfo = { 
        _id: user._id, 
        fullname: user.fullname, 
        
    };
    // You can implement any kind of token creation logic here.
    return JSON.stringify(userInfo);  // Just an example
}

function validateToken(loginToken) {
    try {
        const loggedinUser = JSON.parse(loginToken);
        return loggedinUser;
    } catch (err) {
        console.log('Invalid login token');
    }
    return null;
}
