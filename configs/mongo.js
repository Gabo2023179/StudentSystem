"use strict"

import mongoose from "mongoose"

/**
 * Establece la conexión con la base de datos MongoDB.
 * Configura eventos para detectar cambios en la conexión y manejar errores.
 */
export const dbConnection = async () => {
    try {
        // Evento cuando ocurre un error en la conexión
        mongoose.connection.on("error", () => {
            console.log("MongoDB | connection failed to MongoDB Service")
        })

        // Evento cuando se está intentando conectar a la base de datos
        mongoose.connection.on("connecting", () => {
            console.log("MongoDB | connecting to MongoDB Service")
        })

        // Evento cuando la conexión con MongoDB se establece correctamente
        mongoose.connection.on("connected", () => {
            console.log("MongoDB | connected to MongoDB Service")
        })

        // Evento cuando la conexión con la base de datos está completamente abierta
        mongoose.connection.on("open", () => {
            console.log("MongoDB | connected to Database")
        })

        // Evento cuando la conexión se ha restablecido después de una interrupción
        mongoose.connection.on("reconnected", () => {
            console.log("MongoDB | reconnected to MongoDB Service")
        })

        // Evento cuando la conexión con MongoDB se ha perdido
        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB | disconnected to MongoDB Service")
        })

        // Conectar a la base de datos utilizando la URI definida en las variables de entorno
        await mongoose.connect(process.env.URI_MONGO, {
            serverSelectionTimeoutMS: 5000, // Tiempo de espera antes de fallar la selección del servidor
            maxPoolSize: 50, // Máximo número de conexiones en el pool
        })
    } catch (err) {
        console.log(`Database connection failed: ${err}`)
    }
}
