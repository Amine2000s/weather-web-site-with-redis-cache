import express ,{Request,Response} from 'express';
import bodyParser from 'body-parser';
import axios from 'axios'
import {createClient} from 'redis';
import { create } from 'domain';
import cors from 'cors';  // Import cors package
const app = express();

app.use(bodyParser.json());
app.use(cors({origin:'*'}));

const redisClient = createClient();

redisClient.on('error',(err)=> console.error('Redis Client Error',err));


(async () => {
    await redisClient.connect();
})();

redisClient.on('connect', () => {
    console.log('Connected to Redis!');
  });



const buildWeatherKey = (city:string , state:string) => {

    const info = `weather:city:${city.toLocaleLowerCase()}:state:${state.toLocaleLowerCase()}` ; 

    console.log(info);

    return info ;

}



app.get('/weather',async (req:Request,res:Response) => {

    const {city,wilaya} = req.query;


    const redisKey = buildWeatherKey(city as string , wilaya as string );

    try {

        const cachedWeather = await redisClient.get(redisKey);

        if(cachedWeather){
            
          console.log("data found on redis database");
          res.json(JSON.parse(cachedWeather));
          return;

        }

        console.log('Data not found in Redis. Fetching from API...');

        const response = await axios.get(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}%2C${wilaya}%2Calgeria?unitGroup=metric&include=current&key=A3BW9V896L9736XJZB5DHF9WE&contentType=json`) ;
        
        const weatherData = {
            city,
            wilaya,
            temeprature:response.data.currentConditions.temp,
            condition : response.data.currentConditions.conditions

        }

        console.log(weatherData);

        const save_result = await redisClient.setEx(redisKey,3600,JSON.stringify(weatherData));
        
        console.log(save_result);


         res.json(weatherData);
         return




    }catch(error){

        console.error('Error fetching weather data', error);
         res.status(500).json({ error: 'Unable to retrieve weather data' });
         return;

    }

});


app.listen(3000,'127.0.0.1',()=>{
    console.log("srver is running on port 3000 !!!");
})



/**
 * const redisClient = new redis({
  host: 'your-redis-server.com',  // Specify the Redis server's host
  port: 6379,                     // Specify the Redis port (if different from default)
  password: 'your-redis-password', // Optional: for password-protected Redis instances
  db: 0                           // Optional: use a specific Redis database number (default is 0)
});
 * 
 * 
 * 
 * 
 */