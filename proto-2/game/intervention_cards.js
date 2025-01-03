let intervention_cards = 
[
    {
        "type": "BP",
        "name": "Approve a fish farm",
        "desc": "Municipality has been approached by an offshore fish-farm. The farm will use modern methods to optimise fish yields. ",
        "EP": "2",
        "BP": "-1",
        "FP": "0",
        "DP": "0",
        "HP": "0",
        "pos-1": "Boosts the local economy",
        "pos-2": "Creates local jobs along the fishery value chain",
        "pos-3": "Makes high quality fish available for the local community",
        "neg-1": "Increase in water pollution from farm by-products",
        "neg-2": "Not popular with other water users",
        "neg-3": "On-shore fish processing is smelly",
        "outcome-0": "Water has been greatly contaminated by the operation of the farm. As a result, the natural marine life has been endangered by the release of pathogens and parasites",
        "outcome-1": "The fish farm attracts the local shark population resulting in  a surfer being attacked and wounded. ",
        "outcome-2": "The fish farms are operational and working well, creating jobs and adding fish to the local palette. ",
        "outcome-3": "The fish farming has been a great success! Many more people can afford to have locally supplied fresh fish, saving air miles. The income from the farming has been put back into the local community in educating local fishermen on sustainable fishing practice",
        "img": "fish_farm.jpg"
    },
    {
        "type": "BP",
        "name": "Approve a monofarm",
        "desc": "Municipality has been approached by a commercial farm conglomerate to develop a super-farm on unused farmland. The farm will use modern methods to optimise crop production. ",
        "EP": "3",
        "BP": "-1",
        "FP": "0",
        "DP": "-1",
        "HP": "0",
        "pos-1": "pos-1",
        "pos-2": "pos-2",
        "pos-3": "pos-3",
        "neg-1": "neg-1",
        "neg-2": "neg-2",
        "neg-3": "neg-3",
        "outcome-0": "out-1",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "out-4",
        "img": "monofarm.jpg"
    },
    {
        "type": "BP",
        "name": "citizen MINKA",
        "desc": "This is MINKA",
        "EP": "0",
        "BP": "2",
        "FP": "0",
        "DP": "0",
        "HP": "0",
        "pos-1": "pos-1",
        "pos-2": "pos-2",
        "pos-3": "pos-3",
        "neg-1": "neg-1",
        "neg-2": "neg-2",
        "neg-3": "neg-3",
        "outcome-0": "out-1",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "out-4",
        "img": "dashboard.jpg"
    },
    {
        "type": "BP",
        "name": "Create a biodiversity digital twin",
        "desc": "Add a digital twin to do digital twin stuff",
        "EP": "-1",
        "BP": "3",
        "FP": "0",
        "DP": "0",
        "HP": "0",
        "pos-1": "pos-1",
        "pos-2": "pos-2",
        "pos-3": "pos-3",
        "neg-1": "neg-1",
        "neg-2": "neg-2",
        "neg-3": "neg-3",
        "outcome-0": "out-1",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "out-4",
        "img": "digital_twin.jpg"
    },
    {
        "type": "BP",
        "name": "Create a biodiversity knowledge base",
        "desc": "This sounds like MINKA, but is part of the Sardinia farmer dashboard - although that's ET rather than BD",
        "EP": "-1",
        "BP": "2",
        "FP": "0",
        "DP": "0",
        "HP": "0",
        "pos-1": "pos-1\r",
        "pos-2": "pos-2",
        "pos-3": "pos-3",
        "neg-1": "neg-1",
        "neg-2": "neg-2",
        "neg-3": "neg-3",
        "outcome-0": "out-1",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "out-4",
        "img": "dashboard.jpg"
    },
    {
        "type": "BP",
        "name": "Protect local biodiversity",
        "desc": "This sounds like MINKA",
        "EP": "0",
        "BP": "2",
        "FP": "0",
        "DP": "0",
        "HP": "0",
        "pos-1": "pos-1",
        "pos-2": "pos-2",
        "pos-3": "pos-3",
        "neg-1": "neg-1",
        "neg-2": "neg-2",
        "neg-3": "neg-3",
        "outcome-0": "out-1",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "out-4",
        "img": ""
    },
    {
        "type": "BP",
        "name": "protect local crops",
        "desc": "This is the Sardinia durum wheat scheme. Should strengthen the local farming community and protect local crop types",
        "EP": "2",
        "BP": "2",
        "FP": "0",
        "DP": "0",
        "HP": "0",
        "pos-1": "pos-1",
        "pos-2": "pos-2",
        "pos-3": "pos-3",
        "neg-1": "neg-1",
        "neg-2": "neg-2",
        "neg-3": "neg-3",
        "outcome-0": "out-1",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "out-4",
        "img": "protect_local_crops.jpg"
    },
    {
        "type": "DP",
        "name": "Approve a golf resort development",
        "desc": "Municipality has been approached by a premier resort developer to build a golf course resort on unused land. ",
        "EP": "5",
        "BP": "-1",
        "FP": "0",
        "DP": "-1",
        "HP": "0",
        "pos-1": "Create local jobs",
        "pos-2": "Stimulate the local economy",
        "pos-3": "Create a high-class destination attraction",
        "neg-1": "Course requires significant water resources",
        "neg-2": "Manicured greens negatively impact biodiversity",
        "neg-3": "Landscaping may lead to flood risks",
        "outcome-0": "out-1",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "out-4",
        "img": "golf_course.jpg"
    },
    {
        "type": "DP",
        "name": "Approve reservoir construction ",
        "desc": "Municipality has been approached by the local water company to build a large reservoir in a local valley.",
        "EP": "-2",
        "BP": "-1",
        "FP": "2",
        "DP": "3",
        "HP": "0",
        "pos-1": "Storing winter rains will reduce seasonal flooding",
        "pos-2": "Dependable water for a generation",
        "pos-3": "Will become a home for water birds",
        "neg-1": "Flooding the valley will impact local environment",
        "neg-2": "Cost of development",
        "neg-3": "Time of construction",
        "outcome-0": "out-1",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "out-4",
        "img": "reservoir.jpg"
    },
    {
        "type": "DP",
        "name": "Approve water delivery service",
        "desc": "The municipality is looking to ship in bottled water to ameliorate problems with drinking water supply during drought conditions.",
        "EP": "-2",
        "BP": "0",
        "FP": "0",
        "DP": "2",
        "HP": "0",
        "pos-1": "Dependable supply of quality water",
        "pos-2": "Cheaper than addressing current local supply issues",
        "pos-3": "Popular brand of water",
        "neg-1": "Pollution associated with transporting water",
        "neg-2": "Impact on current local supply capabilities",
        "neg-3": "Public relations issues",
        "outcome-0": " The water quality did not pass the needed checks, and none of the water can be used. ",
        "outcome-1": "Traffic in the town has become much worse due to transporting all the water. There are potholes everywhere and you have some very disgruntled locals.",
        "outcome-2": "The effects of a hot and dry summer have been offset through the water. While not a perfect solution, it has had a positive effect.",
        "outcome-3": "Despite a very hot and dry summer, there\u2019s more than enough water bringing in lots of tourists from other drier areas. ",
        "img": "water_delivery_service.png"
    },
    {
        "type": "DP",
        "name": "Create a drought dashboard",
        "desc": "As per CS5. Municipality will install a platform to monitor climate data in order to better understand drought events.",
        "EP": "-1",
        "BP": "0",
        "FP": "0",
        "DP": "2",
        "HP": "0",
        "pos-1": "pos-1",
        "pos-2": "pos-2",
        "pos-3": "pos-3",
        "neg-1": "neg-1",
        "neg-2": "neg-2",
        "neg-3": "neg-3",
        "outcome-0": "out-1",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "out-4",
        "img": "dashboard.jpg"
    },
    {
        "type": "DP",
        "name": "Create a drought digital twin",
        "desc": "Municipality will install a climate / drought / land use modelling digital twin to evaluate the likelihood and impact of drought scenarios, allowing the town to better prepare for dry periods and long-term planning for drought resilience.",
        "EP": "-1",
        "BP": "0",
        "FP": "0",
        "DP": "3",
        "HP": "0",
        "pos-1": "pos-1",
        "pos-2": "pos-2",
        "pos-3": "pos-3",
        "neg-1": "neg-1",
        "neg-2": "neg-2",
        "neg-3": "neg-3",
        "outcome-0": "out-1",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "out-4",
        "img": "digital_twin.jpg"
    },
    {
        "type": "DP",
        "name": "Install smart water meters",
        "desc": "The municipality is looking to install smart water meters,allowing customers to view consumption and highlight leaks within their houses.",
        "EP": "2",
        "BP": "0",
        "FP": "0",
        "DP": "2",
        "HP": "0",
        "pos-1": "pos-1",
        "pos-2": "pos-2",
        "pos-3": "pos-3",
        "neg-1": "neg-1",
        "neg-2": "neg-2",
        "neg-3": "neg-3",
        "outcome-0": "out-1",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "out-4",
        "img": "smart_meters.jpg"
    },
    {
        "type": "DP",
        "name": "Smart irrigation programme",
        "desc": "The municipality is looking to work with local market gardeners to install smart irrigation systems to reduce water consumptions by providing fertigation-on-demand.",
        "EP": "2",
        "BP": "0",
        "FP": "1",
        "DP": "2",
        "HP": "0",
        "pos-1": "pos-1",
        "pos-2": "pos-2",
        "pos-3": "pos-3",
        "neg-1": "neg-1",
        "neg-2": "neg-2",
        "neg-3": "neg-3",
        "outcome-0": "out-1",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "out-4",
        "img": "smart_irrigation.jpg"
    },
    {
        "type": "FP",
        "name": "Approve construction of a sea wall",
        "desc": "The coast road community is plagued by coastal overtopping, causing disruption to the main coast road and flooding local shops and houses. A sea wall should reduce this almost yearly event.",
        "EP": "2",
        "BP": "0",
        "FP": "2",
        "DP": "0",
        "HP": "0",
        "pos-1": "Minimise flooding risk to the coast road community",
        "pos-2": "Reduce post-flood clean-up costs",
        "pos-3": "Increase investment into the area",
        "neg-1": "Disruption during building works\r",
        "neg-2": "May ruin the view of the bay",
        "neg-3": "Only protects locally",
        "outcome-0": "The project is a disaster! Residents of nearby cliff heights raise a long and costly legal objections as their district is being allowed to erode into the sea, resulting in the project being substaintially delayed. ",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "Shortly after the project completes, there is a huge storm. Unlike previous storms, the coast road district doesn\u2019t flood saving the council by not having to perform a large clean-up. ",
        "img": "sea_wall.jpg"
    },
    {
        "type": "FP",
        "name": "Approve out-of-town leisure resort",
        "desc": "Municipality has been approached by a retail company to develop a large out-of-town retail and leisure park on unused land. ",
        "EP": "4",
        "BP": "-1",
        "FP": "-1",
        "DP": "0",
        "HP": "0",
        "pos-1": "Turn under-used countryside into revenue generating resource",
        "pos-2": "Create local jobs",
        "pos-3": "Bring people into the area for entertainment",
        "neg-1": "Financial impact on current facilities",
        "neg-2": "Impact on current transport network",
        "neg-3": "Enviromental impact",
        "outcome-0": "The complex is a titanic success, so much so that there\u2019s gridlock in and around the town as everybody wants to go there making it impossible to travel anywhere.",
        "outcome-1": "The complex is a success, but heavy rains frequently flood the huge car parks ",
        "outcome-2": "The complex is a success with tenants that complement rather than compete with the town centre attractions. ",
        "outcome-3": "The complex is a real success and careful transport planning has enabled people from all over the region to attend films, gigs, and shows without causing chaos. ",
        "img": "lesiure_resort.jpg"
    },
    {
        "type": "FP",
        "name": "Approve nature-based flood protection",
        "desc": "Municipality has been approached by a university to host a beaver land management project to help control the river and reduce flooding ",
        "EP": "1",
        "BP": "-1",
        "FP": "2",
        "DP": "0",
        "HP": "0",
        "pos-1": "Nature-based solution to manage water and control flooding",
        "pos-2": "Positions council as being open-minded to new solutions in difficult times",
        "pos-3": "Low-cost",
        "neg-1": "Unproven academic and potentially crackpot idea",
        "neg-2": "Impact of beavers on local ecosystem",
        "neg-3": "Difficutlt to unroll if people get attached to beavers",
        "outcome-0": "The research is a disaster! The beavers have moved to the local arboretum and destroyed most of the rare saplings. The university abandoned the research as unworkable.",
        "outcome-1": "The beaver area suffers from a heavy rainstorm  resulting in beaver damn bursts and flooding in the downstream ",
        "outcome-2": "The beaver experiment is working well, and the university is working to increase size of the project, protecting more land. ",
        "outcome-3": "The beaver experiment is working well, with fewer floods. The beavers have been a local point of interest , drawing in beaver tourists and the sale of beaver plushies is through the roof. ",
        "img": "beavers.jpg"
    },
    {
        "type": "FP",
        "name": "Return seaside golf course to sea",
        "desc": "The municipality will stop flood protecting the old sea-side golf course and return it to nature. This will free up finance for other uses. Returning the course to nature will promote biodiversity as it becomes a wetland.",
        "EP": "1",
        "BP": "2",
        "FP": "0",
        "DP": "0",
        "HP": "0",
        "pos-1": "Spend limited budgets where they can have the biggest impact",
        "pos-2": "Creation of a wildlife wetland",
        "pos-3": "Reduce motor traffic by the seaside",
        "neg-1": "Seen as abandoning parts of the town to nature\r",
        "neg-2": "Anger from golfers",
        "neg-3": "Course will be an eyesore whilst wetland is established",
        "outcome-0": "As the golf course returns to nature, the town is hit by a \u2018once in a generation\u2019 storm with extreme tides that rush over the course and undermine the mainline rail track, causing it to be out of use for six months.",
        "outcome-1": "Local golfers protest the decision by playing \u2018urban golf\u2019 in the town centre.  ",
        "outcome-2": "As the course returns to wetland, it becomes a popular destination for firstly, birds and then bird watchers.",
        "outcome-3": "Hearing the news,  a former champion golfer buys the old typewriter factory and rejuvenates it into a high-quality course that keen golfers flock to, boosting tourism substantially. ",
        "img": "golf_course.jpg"
    },
    {
        "type": "FP",
        "name": "Create a flood support website",
        "desc": "As per CS6. Municipality will install a platform to support citizens with support and guidance for flooding.",
        "EP": "-1",
        "BP": "0",
        "FP": "2",
        "DP": "0",
        "HP": "0",
        "pos-1": "pos-1",
        "pos-2": "pos-2",
        "pos-3": "pos-3",
        "neg-1": "neg-1",
        "neg-2": "neg-2",
        "neg-3": "neg-3",
        "outcome-0": "out-1",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "out-4",
        "img": "dashboard.jpg"
    },
    {
        "type": "FP",
        "name": "Create a flooding digital twin",
        "desc": "As per CS6, CS8. Municipality will install a flood modelling digital twin to evaluate the likelihood and impact of potential flooding events, allowing the town to better prepare for flooding and long-term planning for flood resillience.",
        "EP": "-1",
        "BP": "0",
        "FP": "3",
        "DP": "0",
        "HP": "0",
        "pos-1": "pos-1",
        "pos-2": "pos-2",
        "pos-3": "pos-3",
        "neg-1": "neg-1",
        "neg-2": "neg-2",
        "neg-3": "neg-3",
        "outcome-0": "out-1",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "out-4",
        "img": "digital_twin.jpg"
    },
    {
        "type": "FP",
        "name": "Engage in flood plain management",
        "desc": "Municipality has been approached to develop flood plain management for the local river, removing existing developments and allowing land to flood and store flood water. ",
        "EP": "-1",
        "BP": "1",
        "FP": "2",
        "DP": "0",
        "HP": "0",
        "pos-1": "Reduces flooding to the downstream neighbourhoods",
        "pos-2": "Increased biodiversity",
        "pos-3": "Creation of new recreational activities",
        "neg-1": "Disruption during flooding\r",
        "neg-2": "Loss of land to farmers",
        "neg-3": "Flooding",
        "outcome-0": "The project is a disaster! There was a major flood event, and a much larger area of land was flooded. Many farmer's land has been destroyed and polluted waters flow through the town. ",
        "outcome-1": "",
        "outcome-2": "",
        "outcome-3": "The project was a success. A rare species of butterfly has been seen in the area and bird species have increased. The downstream town also did not suffer flooding in the last heavy rainfall event",
        "img": "flood_plain.jpg"
    },
    {
        "type": "HP",
        "name": "Approve installation of cool roofs",
        "desc": "Plans have been submitted to paint roofs with white paint to reflect sunlight on hot days,reducing the overall temperature in buildings andsurrounding environment.",
        "EP": "0",
        "BP": "0",
        "FP": "0",
        "DP": "0",
        "HP": "3",
        "pos-1": "A nature-based solution to reduce urban heat during heatwaves.",
        "pos-2": "Low-cost",
        "pos-3": "Non-envasive",
        "neg-1": "Counter-productive for roof-mounted solar panels",
        "neg-2": "Heatwaves may not be hot enough or long enough for any real benefit.",
        "neg-3": "Painting roofs is messy and time-consuming",
        "outcome-0": "out-1",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "out-4",
        "img": "cool_roofs.jpg"
    },
    {
        "type": "HP",
        "name": "Approve installation of firebreaks",
        "desc": "Municipality is looking to support installing fire breaks in the dry hinterland to stop the frequent heat-induced forest and scrub fires from becoming epidemic and uncontrollable.",
        "EP": "2",
        "BP": "1",
        "FP": "0",
        "DP": "0",
        "HP": "1",
        "pos-1": "pos-1",
        "pos-2": "pos-2",
        "pos-3": "pos-3",
        "neg-1": "neg-1",
        "neg-2": "neg-2",
        "neg-3": "neg-3",
        "outcome-0": "out-1",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "out-4",
        "img": ""
    },
    {
        "type": "HP",
        "name": "Approve installation of green walls",
        "desc": "Green walls will lower urban temperatures making towns more habitable, increasing footfall and revenue.",
        "EP": "1",
        "BP": "1",
        "FP": "0",
        "DP": "0",
        "HP": "2",
        "pos-1": "Provide insulation to buildings and reduce urban temperatures ",
        "pos-2": "Increased Biodiversity and human wellbeing ",
        "pos-3": "Attenuate rainwater and remove air pollutants",
        "neg-1": "Traffic Disruption due to supplies needed\r\r",
        "neg-2": "Increased fire risk if green wall dies. ",
        "neg-3": "Require ongoing maintenance",
        "outcome-0": "The green walls have not been adequately maintained. Clogged drainage systems have led to sewage overflows and spills and created a right old stink in and around the buildings.",
        "outcome-1": "There has been an infestation of  aphids and spiders in one of the buildings and requires additional pest control.",
        "outcome-2": "The project was a success, many people have commented on the reduction of noise and stress within the workplace. ",
        "outcome-3": "The project was a great success. A local study has found that urban temperatures and air pollution have reduced, and less money has been spent on heating the buildings. ",
        "img": "green_walls.jpg"
    },
    {
        "type": "HP",
        "name": "Create a heat knowledge base",
        "desc": "Municipality will install a citizen knowledge base to provide helpful support for dealing with prolonged high temperatures.",
        "EP": "-1",
        "BP": "0",
        "FP": "0",
        "DP": "0",
        "HP": "2",
        "pos-1": "pos-1",
        "pos-2": "pos-2",
        "pos-3": "pos-3",
        "neg-1": "neg-1",
        "neg-2": "neg-2",
        "neg-3": "neg-3",
        "outcome-0": "out-1",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "out-4",
        "img": "dashboard.jpg"
    },
    {
        "type": "HP",
        "name": "Create a heat digital twin",
        "desc": "Municipality will install a climate modelling digital twin to evaluate the likelihood and impact of  extreme temperature scenarios, allowing the town to better prepare for very hot periods and long-term planning for heat resillience.",
        "EP": "-1",
        "BP": "0",
        "FP": "0",
        "DP": "0",
        "HP": "3",
        "pos-1": "pos-1",
        "pos-2": "pos-2",
        "pos-3": "pos-3",
        "neg-1": "neg-1",
        "neg-2": "neg-2",
        "neg-3": "neg-3",
        "outcome-0": "out-1",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "out-4",
        "img": "digital_twin.jpg"
    },
    {
        "type": "HP",
        "name": "Construct a Miyawaki Forest",
        "desc": "Build a Miyawaki forest",
        "EP": "0",
        "BP": "1",
        "FP": "0",
        "DP": "0",
        "HP": "1",
        "pos-1": "pos-1",
        "pos-2": "pos-2",
        "pos-3": "pos-3",
        "neg-1": "neg-1",
        "neg-2": "neg-2",
        "neg-3": "neg-3",
        "outcome-0": "out-1",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "out-4",
        "img": ""
    },
    {
        "type": "HP",
        "name": "Embrace heat tourism",
        "desc": "Municipality is looking to brand the town for 'extreme heat tourism', in order to capture the 'cold euro' from northern European tourists looking for hot holiday action. ",
        "EP": "3",
        "BP": "0",
        "FP": "0",
        "DP": "0",
        "HP": "-1",
        "pos-1": "pos-1",
        "pos-2": "pos-2",
        "pos-3": "pos-3",
        "neg-1": "neg-1",
        "neg-2": "neg-2",
        "neg-3": "neg-3",
        "outcome-0": "out-1",
        "outcome-1": "out-2",
        "outcome-2": "out-3",
        "outcome-3": "out-4",
        "img": "heat_tourism.jpg"
    }
];

