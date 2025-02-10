import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 15 // Solo 15 peticiones por usuario
});


export default apiLimiter