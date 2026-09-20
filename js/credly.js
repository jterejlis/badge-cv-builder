export async function fetchJSONfromURL(username)
{
const workerUrl = `https://cv-builder.jterejlis.workers.dev/?username=${encodeURIComponent(username)}`;
try
{
    let response = await fetch(workerUrl);

    if(!response.ok)
    {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

     let  jsonData = await response.json();
     return jsonData;

}catch(error)
{
    console.error("Error fetching JSON:", error.message);
    throw error;
}   
}


export function sanitiseJSONData(jsonData)
{
    let rawList = Array.isArray(jsonData) ? jsonData : (jsonData.data || []);
    let badges = rawList.map(badge => { return {
        
        title: badge.badge_template?.name || 'Unknown Badge',
        imageUrl: badge.badge_template?.image_url || '',
        issuer: badge.issuer?.entities?.[0]?.entity?.name || 'Unknown Issuer',
        issued_at: badge.issued_at_date || '',
        skills: (badge.badge_template?.skills || []).map(s => s.name),
        selected: true
        };
    });

    return badges  
}