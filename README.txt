Only works within https://koulutuskalenteri.mpk.fi/Koulutuskalenteri domain.



--==### How to load the extension file ###==--


For Firefox users, follow these steps:

In the address bar, search for this:

about:debugging#/runtime/this-firefox

You will see an option to Load Temporary Add-on. Click on that option and choose the manifest.json file from the directory.


For Chrome users:

In the address bar search for this:

chrome://extensions.

    Enable Developer Mode and switch into it.
    Click the Load unpacked button and select the extension directory.



**** NOTE ****: Probably won't work with Chrome, because I developed this with only Firefox in mind and Chrome sucks anyway lmao












I made this thing, because a friend was frustrated with how much unnecessary clicking you need to find how many rehearse days
(kertausharjoituspäivä) you are granted for voluntarily participating in any of these military-organized events. He asked for help and
I accepted. Little did I know then how much of a mess this site actually is under the hood.
On the frontend side one can find the required value after you click any of the course links, but it is within a hidden HTML element
for some moronic reason and for an average user to see it, they would need to click the "find more" link and the info is displayed on
a different page. In addition to this, this hidden HTML (among many others) are loaded from the server only AFTER you click the link,
not during the page load. Not only that, but you can click only one of the links open at a time, thus necessitating the need to interact
with each link individually. AND NOT ONLY THAT, the backend side is a damn mess too, because the data is returned in HTML... These points should
give you some insight as to why the structure of this extension is what it is and, most importantly, why it is so god damn slow.

How it actually works:

-> Newly added button element is clicked
-> HREFs and course IDs are extracted from each course element in the search result array
-> The aforementioned HREF is used to fetch each_damn_indivual course HTML data, which contains the granted rehearse days value
-> Each HTML is then searched through with some nasty tricks to get the rehearse day value
-> Finally, based on the course IDs and rehearse days, the relevant search result array values are highlighted + some other added niceness


Enjoy,

Oskari Tervo
December, 2023









Known bugs:

- If the course grants rehearsal days in double digits or higher, only the first digit is shown, i.e. 10 days would be shown as 1. I am too
lazy to code a solution that would take this into account. And let's be real, the military is never giving away that many days anyway, lol
- If you do the rehearse day search more than once without altering the page in any way (like altering the original search), the number of
days values will be rendered more than once. This is a niche problem (why would you search the same set more than once?) and there is
too much nesting in the code already, so I'll let it be as is.
- Not really a bug, but I really tried to split extractCourseData and fetchCourseData functions into their own file for easier reading,
but I just could not get the import/export to work even after trying different methods for literal hours, so I give up.