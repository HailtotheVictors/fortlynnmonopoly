var mainProperties = [];
mainProperties[0] = {name:'I-9',abbr:'I-9',price:75,interstate:true,color:'white',group:'Interstate',mult:25};
mainProperties[1] = {name:'I-24',abbr:'I-24',price:75,interstate:true,color:'white',group:'Interstate',mult:25};
mainProperties[2] = {name:'I-312',abbr:'I-312',price:75,interstate:true,color:'white',group:'Interstate',mult:25};
mainProperties[3] = {name:'Elli\'s Pizza Restaurant',abbr:'EPR',price:40,rent:[10,20,40,80,160,240],house:20,hotel:30,color:'deeppink',group:'Pink'};
mainProperties[4] = {name:'Elli\'s Botanical Garden',abbr:'EBG',price:40,rent:[10,20,40,80,160,240],house:20,hotel:30,color:'deeppink',group:'Pink'};
mainProperties[5] = {name:'The Driveway',abbr:'DRV',price:70,rent:[15,30,60,120,240,360],house:35,hotel:53,color:'orangered',group:'Orange'};
mainProperties[6] = {name:'The Tree',abbr:'TREE',price:70,rent:[15,30,60,120,240,360],house:35,hotel:53,color:'orangered',group:'Orange'};
mainProperties[7] = {name:'Our Garage',abbr:'GAR',price:80,rent:[17,34,68,136,272,408],house:40,hotel:60,color:'orangered',group:'Orange'};
mainProperties[8] = {name:'The Street',abbr:'STR',price:100,rent:[23,46,92,184,368,552],house:50,hotel:75,color:'limegreen',group:'Lime'};
mainProperties[9] = {name:'Lake Aspen',abbr:'ASP',price:100,rent:[23,46,92,184,368,552],house:50,hotel:75,color:'limegreen',group:'Lime'};
mainProperties[10] = {name:'The Pool',abbr:'POOL',price:110,rent:[26,52,104,208,416,624],house:55,hotel:83,color:'limegreen',group:'Lime'};
mainProperties[11] = {name:'Yosemite Nat\'l Park',abbr:'YOSE',price:115,rent:[27,54,108,216,432,648],house:57,hotel:86,color:'limegreen',group:'Lime'};
mainProperties[12] = {name:'State of New Lynn',abbr:'NEW',price:125,rent:[31,62,124,248,496,744],house:62,hotel:93,color:'gold',group:'Yellow'};
mainProperties[13] = {name:'Lake Lynn',abbr:'LYNN',price:125,rent:[50,100,170,350,700,1000],house:62,hotel:93,color:'gold',group:'Yellow'};
mainProperties[14] = {name:'State of North Libertas',abbr:'SONL',price:150,rent:[41,82,164,328,656,984],house:75,hotel:113,color:'royalblue',group:'Blue'};
mainProperties[15] = {name:'State of Tufton',abbr:'TUF',price:150,rent:[41,82,164,328,656,984],house:75,hotel:113,color:'royalblue',group:'Blue'};
mainProperties[16] = {name:'State of Arstotzka',abbr:'ARS',price:175,rent:[50,100,200,400,800,1200],house:87,hotel:131,color:'mediumvioletred',group:'Purple'};
mainProperties[17] = {name:'State of South Libertas',abbr:'SOSL',price:200,rent:[67,134,268,536,1072,1608],house:100,hotel:150,color:'mediumvioletred',group:'Purple'};
mainProperties[18] = {name:'State of Stella',abbr:'STE',price:200,rent:[67,134,268,536,1072,1608],house:100,hotel:150,color:'mediumvioletred',group:'Purple'};
mainProperties[19] = {name:'State of Carson',abbr:'CAR',price:225,rent:[84,168,336,672,1344,2016],house:135,hotel:203,color:'lightseagreen',group:'Teal'};
mainProperties[20] = {name:'Imperium',abbr:'IMP',price:250,rent:[100,200,400,800,1600,2400],house:150,hotel:225,color:'lightseagreen',group:'Teal'};
var planesAndTrainsPropsOne = [];
planesAndTrainsPropsOne[0] = {name:'Carson-JQG (JQG)',abbr:'JQG',price:100,airport:true,color:'gainsboro',group:'Airport',mult:50};
planesAndTrainsPropsOne[1] = {name:'Zernexumbourg (ZRN)',abbr:'ZRN',price:100,airport:true,color:'gainsboro',group:'Airport',mult:50};
planesAndTrainsPropsOne[2] = {name:'Lake Lynn (LYN)',abbr:'LYN',price:100,airport:true,color:'gainsboro',group:'Airport',mult:50};
planesAndTrainsPropsOne[3] = {name:'Callaway (CAL)',abbr:'CAL',price:100,airport:true,color:'gainsboro',group:'Airport',mult:50};
planesAndTrainsPropsOne[4] = {name:'Tufton (TIA)',abbr:'TIA',price:100,airport:true,color:'gainsboro',group:'Airport',mult:50};
planesAndTrainsPropsOne[5] = {name:'Winfield Cul-de-Sac (CDS)',abbr:'CDS',price:100,airport:true,color:'gainsboro',group:'Airport',mult:50};
var planesAndTrainsPropsTwo = [];
planesAndTrainsPropsTwo[0] = {name:'Max Transit',abbr:'MAX',price:50,rent:[11,22,44,88,176,264],house:25,hotel:38,color:'sienna',group:'Brown'};
planesAndTrainsPropsTwo[1] = {name:'DOT Transit',abbr:'DOT',price:55,rent:[12,24,48,96,192,288],house:28,hotel:41,color:'sienna',group:'Brown'};
planesAndTrainsPropsTwo[2] = {name:'Wagon Station',abbr:'WAG',price:60,rent:[13,26,52,104,208,312],house:30,hotel:45,color:'sienna',group:'Brown'};
planesAndTrainsPropsTwo[3] = {name:'Acela Express',abbr:'ACEL',price:65,rent:[14,28,56,112,224,336],house:33,hotel:49,color:'sienna',group:'Brown'};
planesAndTrainsPropsTwo[4] = {name:'Astella Express',abbr:'ASTE',price:70,rent:[15,30,60,120,240,360],house:35,hotel:53,color:'sienna',group:'Brown'};
var planesAndTrains = planesAndTrainsPropsOne.concat(planesAndTrainsPropsTwo);
var spacePropsOne = [];
spacePropsOne[0] = {name:'Ocean of Storms',abbr:'STRM',price:80,rent:[10,22,48,106,234,515],house:45,hotel:68,color:'skyblue',group:'Light Blue'};
spacePropsOne[1] = {name:'Sea of the Edge',abbr:'EDGE',price:80,rent:[10,22,48,106,234,515],house:45,hotel:68,color:'skyblue',group:'Light Blue'};
spacePropsOne[2] = {name:'Sea of Serenity',abbr:'SERE',price:100,rent:[11,24,53,117,258,567],house:55,hotel:83,color:'skyblue',group:'Light Blue'};
spacePropsOne[3] = {name:'Sea of Tranquility',abbr:'TRNQ',price:100,rent:[11,24,53,117,258,567],house:55,hotel:83,color:'skyblue',group:'Light Blue'};
var spacePropsTwo = [];
spacePropsTwo[0] = {name:'Hellas Planitia',abbr:'HELA',price:120,rent:[29,64,140,309,679,1155],house:90,hotel:180,color:'maroon',group:'Planitia'};
spacePropsTwo[1] = {name:'Isidis Planitia',abbr:'ISID',price:125,rent:[31,68,150,330,726,1234],house:93,hotel:188,color:'maroon',group:'Planitia'};
spacePropsTwo[2] = {name:'Chryse Planitia',abbr:'CHRY',price:130,rent:[33,73,160,351,773,1314],house:98,hotel:195,color:'maroon',group:'Planitia'};
spacePropsTwo[3] = {name:'Argyre Planitia',abbr:'ARGY',price:135,rent:[35,77,170,372,820,1394],house:101,hotel:203,color:'maroon',group:'Planitia'};
spacePropsTwo[4] = {name:'Elysium Mons',abbr:'ELYS',price:140,rent:[37,81,179,394,897,1473],house:105,hotel:210,color:'darksalmon',group:'Mountain'};
spacePropsTwo[5] = {name:'Olympus Mons',abbr:'OLYM',price:145,rent:[39,86,189,415,914,1553],house:109,hotel:218,color:'darksalmon',group:'Mountain'};
spacePropsTwo[6] = {name:'Alba Mons',abbr:'ALBA',price:150,rent:[41,90,198,437,960,1632],house:113,hotel:225,color:'darksalmon',group:'Mountain'};
spacePropsTwo[7] = {name:'Mount Sharp',abbr:'SHRP',price:155,rent:[44,97,213,469,1031,1752],house:116,hotel:233,color:'darksalmon',group:'Mountain'};
var space = spacePropsOne.concat(spacePropsTwo);
var america = [];
america[0] = {name:'Wall Street',abbr:'WLST',price:270,rent:[117,234,468,936,1872,2340],house:162,hotel:324,color:'midnightblue',group:'Stars'};
america[1] = {name:'Mississippi River',abbr:'MISS',price:280,rent:[125,250,500,1000,2000,2500],house:168,hotel:336,color:'midnightblue',group:'Stars'};
america[2] = {name:'Potomac River',abbr:'POTO',price:250,rent:[101,202,404,808,1616,2020],house:150,hotel:300,color:'midnightblue',group:'Stars'};
america[3] = {name:'Pennsylvania Avenua',abbr:'PENN',price:260,rent:[109,218,436,872,1744,2180],house:150,hotel:300,color:'midnightblue',group:'Stars'};
america[4] = {name:'Bourbon Street',abbr:'BOUR',price:260,rent:[109,218,436,872,1744,2180],house:150,hotel:300,color:'red',group:'Stripes'};
america[5] = {name:'One World Trade Center',abbr:'1WTC',price:270,rent:[117,234,468,936,1872,2340],house:162,hotel:324,color:'red',group:'Stripes'};
america[6] = {name:'Empire State Building',abbr:'ESB',price:250,rent:[101,202,404,808,1616,2020],house:150,hotel:300,color:'red',group:'Stripes'};
america[7] = {name:'US Capitol',abbr:'CAP',price:280,rent:[125,250,500,1000,2000,2500],house:168,hotel:336,color:'red',group:'Stripes'};
var allProps = mainProperties.concat(space).concat(planesAndTrains).concat(america);
