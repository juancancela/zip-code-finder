const fs = require('fs');
const path = require('path');

function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

function findNearbyZipCodes(zipCode, zipData, radius = 10) {
    const target = zipData[zipCode];
    if (!target) {
        return [];
    }

    const nearby = [];
    for (const code in zipData) {
        if (code !== zipCode) {
            const data = zipData[code];
            const distance = haversine(target.lat, target.lon, data.lat, data.lon);
            if (distance <= radius) {
                nearby.push(code);
            }
        }
    }

    return nearby;
}

function recursiveZipCodeSearch(zipCode, zipData, maxDepth = 2, depth = 0, radius = 10) {
    if (depth >= maxDepth) {
        return [];
    }

    const results = findNearbyZipCodes(zipCode, zipData, radius);
    if (results.length > 0) {
        return results;
    }

    const nearbyZipCodes = findNearbyZipCodes(zipCode, zipData, radius);
    let allResults = [];
    for (const nearbyZip of nearbyZipCodes) {
        const subResults = recursiveZipCodeSearch(nearbyZip, zipData, maxDepth, depth + 1, radius);
        allResults = allResults.concat(subResults);
        if (allResults.length >= 5) {
            break;
        }
    }

    return allResults;
}

//Print the zip_data to verify
//console.log(zipData);

// Example usage
//const zipCode = '1636';
//const zips = recursiveZipCodeSearch(zipCode, zipData);
//console.log("Nearby zip codes:", zips);

//for (const zip of zips) console.log(zipData[zip]);

module.exports = {
    recursiveZipCodeSearch
}