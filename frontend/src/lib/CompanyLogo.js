export const logoPlaceholders = [
    "https://assets-global.website-files.com/6365d860c7b7a7191055eb8a/65a38f6d73352e86a3fd302e_capsule-logomark.svg",
    "https://assets-global.website-files.com/6365d860c7b7a7191055eb8a/65a38f9a390d57d9164fc64d_cloudwatch-logomark.svg",
    "https://assets-global.website-files.com/6365d860c7b7a7191055eb8a/65a38fb3a013c1ba8d6eb55c_command-r-logomark.svg",
    "https://assets-global.website-files.com/6365d860c7b7a7191055eb8a/65a38fcbc64d193880c9026c_epicurious-logomark.svg",
    "https://assets-global.website-files.com/6365d860c7b7a7191055eb8a/65a38feb88420b743e0845bf_featherdev-logomark.svg",
    "https://assets-global.website-files.com/6365d860c7b7a7191055eb8a/65a390080e2f09b58a9d90ad_focalpoint-logomark.svg",
    "https://assets-global.website-files.com/6365d860c7b7a7191055eb8a/65a390220d444dfb5d4b5209_galileo-logomark.svg",
    "https://assets-global.website-files.com/6365d860c7b7a7191055eb8a/65a3903f4f8aa39a2cd26cff_globalbank-logomark.svg",
    "https://assets-global.website-files.com/6365d860c7b7a7191055eb8a/65a390926546cc8627b63e09_layers-logomark.svg",
    "https://assets-global.website-files.com/6365d860c7b7a7191055eb8a/65a39079322cb1690d7df5fe_interlock-logomark.svg",
    "https://assets-global.website-files.com/6365d860c7b7a7191055eb8a/65a390afcf52ccbdc4520c7e_lightbox-logomark.svg",
    "https://assets-global.website-files.com/6365d860c7b7a7191055eb8a/65a390dfdc1efbe1908c169a_luminous-logomark.svg",
    "https://assets-global.website-files.com/6365d860c7b7a7191055eb8a/65a390f89dc5202983246cbb_nietzche-logomark.svg",
    "https://assets-global.website-files.com/6365d860c7b7a7191055eb8a/65a39135b685e60b3b47f4b5_quotient-logomark.svg",
    "https://assets-global.website-files.com/6365d860c7b7a7191055eb8a/65a391b1f0fb75ff6542e70f_spherule-logomark.svg",
    "https://assets-global.website-files.com/6365d860c7b7a7191055eb8a/65a345821acb334f05468ad0_alt-shift-logomark.svg",
]

export async function getLogo(name) {
    const apiKey = 'yja6dlvJm8X7GDdWNdakbg==uA5xHZd1MPcm7tlI';
    const url = `https://api.api-ninjas.com/v1/logo?name=${name}`;

    const options = {
        method: 'GET',
        headers: {
            'X-Api-Key': apiKey,
            'Content-Type': 'application/json'
        }
    };
    try {
        const result =await fetch(url, options)
        const data = await result.json();
        return data.image;
    }
    catch (error) {
        console.error(error);
    }
}