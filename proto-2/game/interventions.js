let interventions =
    [
    {
        "type": "DP",
        "name": "Build a golf resort",
        "desc": "Municipality has been approached by a premier resort devleoper to build a golf course resort on unsued land. This will create local jobs and greatly stimulate the economy, but the manicured greens will adversely impact BD and the resort's water requirements may adversely impact the town's water supply",
        "EP": "5",
        "BP": "-1",
        "FP": "0",
        "DP": "-1",
        "TP": "0"
    },
    {
        "type": "FP",
        "name": "Approve out-of-town shopping resort",
        "desc": "Municipality has been approached by a retail company to develop a large out-of-town retail and lesiure park on unsued land.This will create local jobs and stimulate the economy, but the build will adversely impact BD and large car parks are likely to be a flooding risk",
        "EP": "4",
        "BP": "-1",
        "FP": "-1",
        "DP": "0",
        "TP": "0"
    },
    {
        "type": "ET",
        "name": "Embrace heat tourism",
        "desc": "Municipality is looking to brand the town for 'extreme heat tourism', in order to capture the 'cold euro' from northern european tourists looking for heat. Whilst this strategy will bring in revenue, it is accepting that heat is here to stay and the region will look to remain hot, rather than being cool(er).",
        "EP": "3",
        "BP": "0",
        "FP": "0",
        "DP": "0",
        "TP": "-1"
    },
    {
        "type": "BD",
        "name": "Approve a monofarm",
        "desc": "Minicipality has been approached by a commercial farm conglomorate to develop a super-farm on unused farmland. The farm will use modern methods to optimise crop production. This may impact the local environment and may have an adverse impact on local water supply, though it will create local jobs and stimulate the economy.",
        "EP": "3",
        "BP": "-1",
        "FP": "0",
        "DP": "-1",
        "TP": "0"
    },
    {
        "type": "BD",
        "name": "Protect local crops",
        "desc": "This is the Sardinia durum wheat scheme.Should strengthen the local farming community and protect local crop types",
        "EP": "2",
        "BP": "2",
        "FP": "0",
        "DP": "0",
        "TP": "0"
    },
    {
        "type": "ET",
        "name": "Construct Fire breaks",
        "desc": "Municipality is looking to support installing fire breaks in the dry hinterland to stop the frequent heat-induced forest and scrub fires from becoming epidemic and uncontrollable. Doing this will reduce the associated costs of clean-up after a fire and should promote biodiversity as less of the land will be fire damaged",
        "EP": "2",
        "BP": "1",
        "FP": "0",
        "DP": "0",
        "TP": "1"
    },
    {
        "type": "FP",
        "name": "Build a sea wall",
        "desc": "Municipality has been approached to support the development of a sea wall to lessen the impact of costal overtopping during winter storms. The wall should reduce flooding and reduce the cost of post-flood clean-up and rebuilding",
        "EP": "2",
        "BP": "0",
        "FP": "2",
        "DP": "0",
        "TP": "0"
    },
    {
        "type": "DP",
        "name": "Develop Smart irrigation",
        "desc": "The municipality is looking to work with local market gardeners to install smart irrigation systems to reduce water consumptions by providing fertigation-on-demand. This will also reduce agricultural flooding as water will be more controlled",
        "EP": "2",
        "BP": "0",
        "FP": "1",
        "DP": "2",
        "TP": "0"
    },
    {
        "type": "DP",
        "name": "Install smart water meters",
        "desc": "The municipality is looking to install smart water meters in the local towns. The meters will allow customers to see their consumption on an hourly basis and highlight leaks within thier houses. This should reduce customer consumption and reduce the loading on the water network during peak drought periods. Reduced consumption implies less water processing, saving money.",
        "EP": "2",
        "BP": "0",
        "FP": "0",
        "DP": "2",
        "TP": "0"
    },
    {
        "type": "ET",
        "name": "Miyawaki Forest",
        "desc": "Build a Miyawaki forest",
        "EP": "0",
        "BP": "1",
        "FP": "0",
        "DP": "0",
        "TP": "1"
    },
    {
        "type": "BD",
        "name": "fish farm",
        "desc": "Minicipality has been approached by an offshore fish-farm. The farm will use modern methods to optimise fish yields. This may impact the local environment, though it will create local jobs and stimulate the economy.",
        "EP": "2",
        "BP": "-1",
        "FP": "0",
        "DP": "0",
        "TP": "0"
    },
    {
        "type": "FP",
        "name": "Remove flood protection",
        "desc": "The municipality will stop flood protecting the old sea-side golf course and return it to nature. This will free up finance for other uses. Returning the course to nature will promote biodiversity as it becomes a wetland.",
        "EP": "1",
        "BP": "2",
        "FP": "0",
        "DP": "0",
        "TP": "0"
    },
    {
        "type": "ET",
        "name": "Green walls",
        "desc": "Green walls will lower urban temperatures making towns more habitable, increasing footfall and revenue.",
        "EP": "1",
        "BP": "1",
        "FP": "0",
        "DP": "0",
        "TP": "2"
    },
    {
        "type": "FP",
        "name": "Beaver flood protection",
        "desc": "Municipality has been approached by a university to host a beaver land management project,  in which beavers will build natural flood defences. Introducing beavers is likely to negatively impact local biodiversity, but managing water should reduce the cost of flood clean-ups.",
        "EP": "1",
        "BP": "-1",
        "FP": "2",
        "DP": "0",
        "TP": "0"
    },
    {
        "type": "BD",
        "name": "protect local biodiversity",
        "desc": "This sounds like MINKA",
        "EP": "0",
        "BP": "2",
        "FP": "0",
        "DP": "0",
        "TP": "0"
    },
    {
        "type": "BD",
        "name": "citizen MINKA",
        "desc": "This is MINKA",
        "EP": "0",
        "BP": "2",
        "FP": "0",
        "DP": "0",
        "TP": "0"
    },
    {
        "type": "ET",
        "name": "Cool roofs",
        "desc": "Cool roofs will lower urban temperatures making towns more habitable",
        "EP": "0",
        "BP": "0",
        "FP": "0",
        "DP": "0",
        "TP": "3"
    },
    {
        "type": "BD",
        "name": "BD digital twin",
        "desc": "Add a digital twin to do digital twin stuff",
        "EP": "-1",
        "BP": "3",
        "FP": "0",
        "DP": "0",
        "TP": "0"
    },
    {
        "type": "BD",
        "name": "BD knowledge base",
        "desc": "This sounds like MINKA, but is part of the Sardinia farmer dashboard - although that's ET rather than BD",
        "EP": "-1",
        "BP": "2",
        "FP": "0",
        "DP": "0",
        "TP": "0"
    },
    {
        "type": "FP",
        "name": "Flood plain management",
        "desc": "Municiplaity has been approached to develop flood plain management for the local river, removing exisiting developments and allowing land to flood and store flood water. It will cost the minicipality to take land out of use, but the wetlands will promote wildlife and should create a large and effective nature-based flooding solution",
        "EP": "-1",
        "BP": "1",
        "FP": "2",
        "DP": "0",
        "TP": "0"
    },
    {
        "type": "FP",
        "name": "FP digital twin",
        "desc": "As per CS6, CS8. Municipality will install a flood modelling digital twin to evaluate the likelihood and impact of potential flooding events, allowing the town to better prepare for flooding and long-term planning for flood resillience.This will cost opex to run",
        "EP": "-1",
        "BP": "0",
        "FP": "3",
        "DP": "0",
        "TP": "0"
    },
    {
        "type": "FP",
        "name": "FP knowledge base / citizen engagment",
        "desc": "As per CS6. Municipality will install a platform to support citizens with support and guidance for flooding. This will cost opex to run, but will provide flood protection support",
        "EP": "-1",
        "BP": "0",
        "FP": "2",
        "DP": "0",
        "TP": "0"
    },
    {
        "type": "DP",
        "name": "DP digital twin",
        "desc": "Municipality will install a climate / drought / land use modelling digital twin to evaluate the likelihood and impact of drought scenarios, allowing the town to better prepare for dry periods and long-term planning for drought resillience. This will cost opex to run",
        "EP": "-1",
        "BP": "0",
        "FP": "0",
        "DP": "3",
        "TP": "0"
    },
    {
        "type": "DP",
        "name": "DP dashboard",
        "desc": "As per CS5. Municipality will install a platform to monitor climate data in order to better understand drought events. This will cost opex to run",
        "EP": "-1",
        "BP": "0",
        "FP": "0",
        "DP": "2",
        "TP": "0"
    },
    {
        "type": "ET",
        "name": "ET digital twin",
        "desc": "Municipality will install a climate / temperature / land use modelling digital twin to evaluate the likelihood and impact of  extreme temperature scenarios, allowing the town to better prepare for very hot periods and long-term planning for heat resillience.This will cost opex to run",
        "EP": "-1",
        "BP": "0",
        "FP": "0",
        "DP": "0",
        "TP": "3"
    },
    {
        "type": "ET",
        "name": "ET knowledge base",
        "desc": "Municipality will install a citizen knowledge base to provide helpful support for dealing with prolonged high temperatures. This will cost opex to run",
        "EP": "-1",
        "BP": "0",
        "FP": "0",
        "DP": "0",
        "TP": "2"
    },
    {
        "type": "DP",
        "name": "Ship in drinking water",
        "desc": "The municipality is looking to ship in bottled water to ameliroate problems with drinking water supply during drought conditions. It will cost money to ship in the water, but it will provide an almost limitless supply of drinking water. ",
        "EP": "-2",
        "BP": "0",
        "FP": "0",
        "DP": "2",
        "TP": "0"
    },
    {
        "type": "DP",
        "name": "Build a reservoir",
        "desc": "Municipality has been approached by the local water company to build a large resevoir in a local valley. Given the wet winters, the full reservoir will address drought issues for at least a generation, in spite of its relatively high cost, and will lessen the impact of winter flooding. However, flooding a large valley will adversely impact local biodiversity.",
        "EP": "-2",
        "BP": "-1",
        "FP": "2",
        "DP": "3",
        "TP": "0"
    }
];