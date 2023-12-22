"use strict";
window.onload = () => {
    getLoginData();
    displayPosts()
    displayUserProfileInfo();
}
function getLoginData() {
    const loginDataString = window.localStorage.getItem('login-data');
    // console.log(loginDataString);
    return loginDataString ? JSON.parse(loginDataString) : null;
}

async function fetchPosts() {
    const loginData = getLoginData();

    if (!loginData || !loginData.token) {
        console.error('User not logged in.');
        return
    }

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${loginData.token}`,
        },
    };
    try {
        const response = await fetch(apiBaseURL + "/api/posts", options);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log('Fetch Failed', error);
    }
}

async function getUserData() {
    const loginData = getLoginData();
    console.log(loginData);
    if (!loginData || !loginData.token) {
        console.error('User not logged in.');
        return
    }
    const userData = loginData.username;
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${loginData.token}`,
        },
    };
    try {
        const response = await fetch(apiBaseURL + "/api/users/" + userData, options);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log('Fetch Failed', error);
    }
}

async function displayUserProfileInfo() {
    const userInfo = await getUserData();
    console.log(userInfo);
     const profileInfo = document.getElementById('profileInfo');
     const welcomeUser = document.getElementById('welcome-container');
    welcomeUser.style.color = "#7E7F9C"
    profileInfo.innerHTML = `
        <p>${userInfo.fullName}</p>
        <span>${userInfo.username}</span>
        `
    welcomeUser.innerHTML = `
        <h1> Welcome ${userInfo.fullName}</h1>`
}

async function displayPosts() {
    const postData = await fetchPosts();
    // console.log(postData);

    const postsContainer = document.getElementById('posts-container');

    if (postData.length === 0) {
        postsContainer.innerHTML = '<p>No posts available.</p>';
        return;
    }

    postData.forEach(item => {
        const createPostDiv = document.createElement('div');
        createPostDiv.style.color = "#7E7F9C"
        createPostDiv.innerHTML = `
            <h3>${item.username}</h3>
            <p>${item.text}</p>
            <hr>
            `
            postsContainer.appendChild(createPostDiv)
    })
}



function logout() {
    const loginData = getLoginData();

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${loginData.token}`,
        },
    };

    fetch(apiBaseURL + "/auth/logout", options)
        .then(response => response.json())
        .then(data => console.log(data))
        .finally(() => {
            window.localStorage.removeItem("login-data");
            window.location.assign("/");
        });
}


