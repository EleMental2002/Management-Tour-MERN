import jwt from 'jsonwebtoken'

const verifyToken = async (req, res, next, role) => {


    const tokenName = role === "admin" ? "adminToken" : "userToken";
    const token = await req.cookies[tokenName];
    // console.log(token);

    try {
        if (!token) {
            return res.status(401).json({ success: false, message: "You're not authenticated" })
        }
        // else{
        //    res.status(200).json({ success: true, message: "You're authenticated", token: token })

        // }

        // if token  exist then verify the token

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: "token invalid" })
            }

            req.decoded = decoded

            //! Authorization check
            if (req.decoded.id === req.params.id && req.decoded.role === "user") {

                next()
            }
            else if (req.decoded.role === "admin") {
                next()

            }
            else {
                return res.status(401).json({ success: false, message: "You're not authorized" })
            }

        })

    } catch (err) {
        res.status(400).json({ success: false, error: err })
    }

}

export const verifyUser = async (req, res, next) => {
    verifyToken(req, res, next, "user");
}

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next, "admin");
}