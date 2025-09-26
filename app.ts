import express, { Request, Response } from 'express'
import 'dotenv/config'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import bootstrap from 'bootstrap'
import passport from 'passport'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import session from 'express-session'
import { PrismaClient } from './generated/prisma'
import { PrismaSessionStore } from '@quixo3/prisma-session-store'
import authRouter from './routes/auth.routes.ts'
import folderRouter from './routes/folder.routes.ts'
import fileRouter from './routes/file.routes.ts'


const app = express()
const PORT = process.env.PORT || 3000

// Dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Statics files
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

// ejs
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        const method = req.body._method
        delete req.body._method
        return method
    }
}))
app.use(express.json())

app.use(
    session({
        secret: process.env.SESSION_SECRET || "cats",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, // 1 jour
        },
        store: new PrismaSessionStore(
            new PrismaClient(), // Cast to 'any' to satisfy type requirement
            {
                checkPeriod: 2 * 60 * 1000,  // toutes les 2 min, supprime les sessions expirées
                dbRecordIdIsSessionId: true, // option pratique
                dbRecordIdFunction: undefined,
            }
        ),
    })
);

// Bootstrap
app.use(
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/"))
);
app.use(
    express.static(path.join(__dirname, "node_modules/bootstrap-icons/font/"))
);


// Passport
import './config/passport.js'
import { isAuth } from './middlewares/auth.middleware.ts'
app.use(passport.initialize())
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user
    next();
});

// Routes
app.get(
    '/',
    isAuth,
    (req, res) => res.render('index', {
        page_name: "home",
        title: "Home"
    })
)
app.use(authRouter)
app.use('/folders', folderRouter)
app.use('/files', fileRouter)

// 404 
app.use((req: Request, res: Response) => {
    res.status(404).render('404', {
        page_name: "404",
        title: "404 - Page Not Found"
    })
})

app.listen(PORT, (err) => {
    if (err) throw err
    console.log(`📁 File Uploader 🚀 listening on port ${PORT}`);
})