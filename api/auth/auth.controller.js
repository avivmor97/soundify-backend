import { authService } from './auth.service.js'
import { logger } from '../../services/logger.service.js'
import {userService} from './../user/user.service.js'
import bcrypt from 'bcryptjs';

// auth.controller.js
export async function login(req, res) {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }

        const user = await userService.getByUsername(username);

        if (!user || !user.password) {
            return res.status(401).send('Invalid username or password');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).send('Invalid username or password');
        }

        // Set token or session
        res.cookie('loginToken', 'example-token', { httpOnly: true });
        res.send(user);
    } catch (err) {
        console.error('Failed to login:', err);
        res.status(500).send('Failed to login');
    }
}




export async function signup(req, res) {
	try {
		const credentials = req.body

		// Never log passwords
		// logger.debug(credentials)
		
        const account = await authService.signup(credentials)
		logger.debug(`auth.route - new account created: ` + JSON.stringify(account))
		
        const user = await authService.login(credentials.username, credentials.password)
		logger.info('User signup:', user)
		
        const loginToken = authService.getLoginToken(user)
		res.cookie('loginToken', loginToken, { sameSite: 'None', secure: true })
		res.json(user)
	} catch (err) {
		logger.error('Failed to signup ' + err)
		res.status(400).send({ err: 'Failed to signup' })
	}
}

export async function logout(req, res) {
	try {
		res.clearCookie('loginToken')
		res.send({ msg: 'Logged out successfully' })
	} catch (err) {
		res.status(400).send({ err: 'Failed to logout' })
	}
}

export async function validateToken(req, res) {
    try {
        const token = req.cookies.loginToken;
        if (!token) return res.status(401).json({ isLoggedIn: false });

        const user = authService.validateToken(token); // Assuming this function exists and works as expected
        if (user) {
            res.status(200).json({ isLoggedIn: true, user });
        } else {
            res.status(401).json({ isLoggedIn: false });
        }
    } catch (err) {
        console.error('Token validation error:', err);
        res.status(500).json({ err: 'Failed to validate token' });
    }
}

