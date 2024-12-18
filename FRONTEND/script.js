


async function loadJson(){

    try{
        const response = await fetch('algeria_cities.json');

        if(!response.ok){
            throw new console.error("Respone not okay");
        }

        const data = await response.json();
        return data ; 

    }catch(error){
        
        console.error("error loading json ",error);

    }

}

async function populateStatesAndCities(){

    const citiesData = await loadJson();

    const wilayaTocities = {}; 

    citiesData.forEach(city => {
        
        const wilaya = city.wilaya_name_ascii;
        const cityName = city.commune_name_ascii;


        if(!wilayaTocities[wilaya]){
            wilayaTocities[wilaya]=[];
        }


        wilayaTocities[wilaya].push(cityName);



    });

    const stateSelect = document.getElementById('state')

    Object.keys(wilayaTocities).forEach(wilaya => {

        const option = document.createElement('option');
        option.value = wilaya ; 
        option.textContent = wilaya ; 
        stateSelect.appendChild(option);


    });

    stateSelect.addEventListener('change', ()=>{
        
        const selectedWilaya = stateSelect.value;

        const cities =  wilayaTocities[selectedWilaya] || [] ; 

        const citySelect = document.getElementById('city');
        citySelect.innerHTML ='<option value="">Select a city</option>';

        cities.forEach(city => {

            const option = document.createElement('option');
            option.value = city;
            option.textContent = city ; 
            citySelect.appendChild(option)


        })


    })

}

document.getElementById('getWeather').addEventListener('click', async function () {
    const city = document.getElementById('city').value;
    const wilaya = document.getElementById('state').value;

    if (!city || !wilaya) {
        alert('Please enter both city and wilaya!');
        return;
    }

    // Make API call to your backend
    try {
        const response = await fetch(`http://localhost:3000/weather?city=${city}&wilaya=${wilaya}`);//http://localhost:3000/weather?city=${city}&wilaya=${wilaya}
        const data = await response.json();
        if (response.ok) {
            // Show the data in the popupc
            showPopup(data);
        } else {
            alert('Error fetching weather data');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data');
    }
});

// Function to display the popup with weather data
function showPopup(data) {
    const weatherDetails = `
        <strong>City:</strong> ${data.city}<br>
        <strong>Wilaya:</strong> ${data.wilaya}<br>
        <strong>Temperature:</strong> ${data.temeprature} °C<br>
        <strong>Condition:</strong> ${data.condition}
    `;
    document.getElementById('weatherDetails').innerHTML = weatherDetails;

    // Show the popup
    document.getElementById('popup').style.display = 'flex';
}

// Close popup when clicking the 'X' button
document.getElementById('closePopup').addEventListener('click', function () {
    document.getElementById('popup').style.display = 'none';
});



 populateStatesAndCities();