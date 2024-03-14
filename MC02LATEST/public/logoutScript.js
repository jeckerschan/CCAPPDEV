
console.log("loginScript.js is loaded!");

document.addEventListener("DOMContentLoaded", function() {
    const btnYes = document.querySelector(".btn-yes");




    btnYes.addEventListener("click", function() {
        fetch("http://localhost:3000/removeTempAccount", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
            })
        })
        .then(response => {
            if (response.ok) {
                console.log("session account removed successfully");
      
            } else {
                console.error("Failed to remove session account");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
    });
});
