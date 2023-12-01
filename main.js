const regex = /\d+/g;

// Add new elements

const searchFilters = document.getElementById("search-filters-floater");

const button = document.createElement("button");
button.appendChild(document.createTextNode("Etsi KHPV"));
button.setAttribute("id", "start-button");
searchFilters.appendChild(button);

const counterLeft = document.createElement("h6");
counterLeft.appendChild(document.createTextNode(""));
counterLeft.setAttribute("id", "course-counter-left");
searchFilters.appendChild(counterLeft);

const counterRight = document.createElement("h6");
counterRight.appendChild(document.createTextNode(""));
counterRight.setAttribute("id", "course-counter-right");
searchFilters.appendChild(counterRight);

const results = document.createElement("h6");
results.appendChild(document.createTextNode(""));
results.setAttribute("id", "results-count");
searchFilters.appendChild(results);

// Styling
button.style.position = "relative";
button.style.right = 0;
button.style.margin = "0.6rem";
button.style.height = "1.6rem";
button.style.width = "5rem";
button.style.backgroundColor = "#b4f0ca";
button.style.borderColor = "#6be899";
button.style.fontWeight = "bold";
button.style.boxShadow = "0.25rem";
button.style.color = "#0e8a3b"

counterLeft.style.position = "relative";
counterLeft.style.display = "none";
counterLeft.style.marginLeft = "1rem";

counterRight.style.position = "relative";
counterRight.style.display = "none";
counterRight.style.marginLeft = "1rem";

results.style.position = "relative";
results.style.display = "none";
results.style.margin = "1.2rem";
results.style.fontWeight = "bold";
results.style.display= "inline-block";

// Event handlers
button.addEventListener("mouseenter", function( event ) {
    if (!document.getElementById("start-button").disabled) {
        event.target.style.color = "#15c254";
        button.style.borderColor = "#77fca8";
        button.style.backgroundColor = "#c0fad5";    
    }
}, false);

button.addEventListener("mouseleave", function( event ) {
    event.target.style.color = "#0e8a3b";
    button.style.borderColor = "#6be899";
    button.style.backgroundColor = "#b4f0ca";
}, false);

button.addEventListener("click", e => {
    e.preventDefault();

    document.getElementById("start-button").disabled = true;
    button.style.opacity = "0.5";

    const events = document.querySelectorAll(".event");

    counterLeft.style.display= "inline-block";
    counterRight.style.display= "inline-block";

    document.getElementById("results-count").innerHTML = "";
    document.getElementById("course-counter-left").innerHTML = "0";
    document.getElementById("course-counter-right").innerHTML = ` / ${events.length}`;

    const as = [];
    
    for (let i = 0; i < events.length; i++) {
        as.push(events[i].querySelector("a"));
    }
    
    const hrefDataArr = as.map((a) => {
        return {
            id: String(a.id).split("-")[1],
            href: a.href
        }
    })

    const fetchCourseData = async (href) => {
        // Response is in HTML, because MPK site is shit
        const response = await fetch(href);
        return await response.text();
    }
    
    const extractCourseData = async (hrefDataArr) => {
        const courses = [];
    
        console.log('Begin data extraction');
    
        let coursesWithRehearseDays = 0;
    
        for (let i = 0; i < hrefDataArr.length; i++) {
            const html = await fetchCourseData(hrefDataArr[i].href);
            const startIndex = html.search("Kertausharjoituspäivät");
            // 120 ensures the date value is within the slice output and that there are no other digits. Nasty solution, but works
            const htmlSlice = html.slice(startIndex, startIndex + 120);
            const daysStartIndex = htmlSlice.search(regex);
    
            const rehearseDaysGranted = Number(htmlSlice.slice(daysStartIndex, daysStartIndex + 1));
            courses.push({
                id: hrefDataArr[i].id,
                rehearseDays: rehearseDaysGranted
            })
    
            const counter =  document.getElementById("course-counter-left");
            counter.innerHTML = `${Number(counter.innerHTML) + 1}`;
            if (rehearseDaysGranted !== 0) coursesWithRehearseDays++;
        }
    
        document.getElementById("results-count").innerHTML = `Yhteensä ${coursesWithRehearseDays} kertauspäiväkurssia`;
    
        console.log('Data extraction finished');

        return courses;
    }

    // Handle results
    extractCourseData(hrefDataArr).then((courses) => {
        document.getElementById("start-button").disabled = false;
        button.style.opacity = "1";

        courses.forEach(course => {
            if (course.rehearseDays !== 0) {
                const event = document.getElementById(`event-${course.id}`);

                event.style.backgroundColor = "#6be899";

                const grantedDays = document.createElement("div");
                grantedDays.appendChild(document.createTextNode(`Kertauspäiviä: ${course.rehearseDays}`));
                grantedDays.setAttribute("id", `granted-days-${course.id}`);
                event.appendChild(grantedDays);

                grantedDays.style.position = "relative";
                grantedDays.style.display = "inline-block";
                grantedDays.style.fontWeight = "bold";
                grantedDays.style.fontSize = "0.7rem";
            }
        })
    })
})
