// server.js
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/db');
const initiativeRoutes = require('./routes/initiativeRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./utils/errorHandler');
require('dotenv').config();
const Token = require('./models/Token');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/initiatives', initiativeRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

sequelize.authenticate()
    .then(() => {
        console.log('Database connected...');
        sequelize.sync()
    })
    .then(async() => {
        console.log('Models synchronized with the database');
        // Ensure admin user exists
        const User = require('./models/User');
        const adminUser = await User.findOne({ where: { email: 'administrator@dobrovoltsibg.com' } });
        if (!adminUser) {
            await User.create({
                name: 'Administrator',
                email: 'administrator@dobrovoltsibg.com',
                password: 'dobrovoltsibg',
                role: 'admin'
            });
            console.log('Admin user created with username: administrator@dobrovoltsibg.com and password: dobrovoltsibg');
        }
    })
    .catch(err => console.log('Error: ' + err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});