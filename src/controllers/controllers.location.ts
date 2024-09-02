import { Request, Response } from 'express';
import axios from 'axios';
import { connectToDatabase } from '../database';
import Location from '../database/models/models.location';

export const setLocation = async (request: any, response: Response) => {
    const { longitude, latitude } = request.body;
    const user = request.user; // Assuming this is set by middleware (e.g., authentication middleware)
 console.log(user);
 
    try {
        await connectToDatabase();

        // Reverse geocode to get the location name
        const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        const geocodeResponse = await axios.get(geocodeUrl);
        const locationName = geocodeResponse.data.name;
        console.log(geocodeResponse.data);
        

        // Create a new location instance
        const newLocation = new Location({
            longitude,
            latitude,
            user: user._id, 
            name:locationName, 
        });

        // Save the location to the database
        await newLocation.save();

        return response.status(200).send({ msg: "Location saved successfully", location: newLocation });
    } catch (error) {
        console.error("Error saving location:", error);
        return response.status(500).send({ msg: "Internal server error", error });
    }
};
