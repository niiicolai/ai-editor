
export const authorize = (role='admin') => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: "No user" });
        if (!req.user.role) return res.status(401).json({ message: "No role" });
        if (req.user.role !== role) return res.status(403).json({ message: "Forbidden" });

        next();
    }
};
