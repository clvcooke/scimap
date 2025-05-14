export type GrantTermination = {
    // FIPS: number;
    // reporter_url: string;
    // award_remaining: number | null;
    // terminated_loss: number;
    // terminated_num: number;
    // termination_date: string | null;
    org_name: string;
    // project_title: string;
    // cancellation_source: string;
    lat: number;
    lon: number;
    terminated_loss: number;
    terminated_num: number;
    terminated_loss_noself: number;
    terminated_num_noself?: number;
}


// HACK BECAUSE WE WANT TO SPLIT THE GRANT DATA UP

const grant_losses_2: GrantTermination[] = [{
    "org_name": "University of Texas Medical Branch Galveston",
    "lat": 29.311028,
    "lon": -94.778007,
    "terminated_loss": 39168123,
    "terminated_num": 2,
    "terminated_loss_noself": 39168123,
    "terminated_num_noself": 2
}, {
    "org_name": "University of Texas MD Anderson Cancer Center",
    "lat": 29.706319,
    "lon": -95.397195,
    "terminated_loss": 980197,
    "terminated_num": 2,
    "terminated_loss_noself": 980197,
    "terminated_num_noself": 2
}, {
    "org_name": "Florida Agricultural and Mechanical University",
    "lat": 30.428914,
    "lon": -84.289766,
    "terminated_loss": 7522925,
    "terminated_num": 1,
    "terminated_loss_noself": 7522925,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Texas Southwestern Medical Center",
    "lat": 32.811963,
    "lon": -96.837534,
    "terminated_loss": 5396439,
    "terminated_num": 2,
    "terminated_loss_noself": 5396439,
    "terminated_num_noself": 2
}, {
    "org_name": "Clark Atlanta University",
    "lat": 33.747725,
    "lon": -84.41301,
    "terminated_loss": 294345,
    "terminated_num": 1,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "Charles R. Drew University of Medicine & Science",
    "lat": 33.923952,
    "lon": -118.245687,
    "terminated_loss": 36542151,
    "terminated_num": 2,
    "terminated_loss_noself": 36542151,
    "terminated_num_noself": 1
}, {
    "org_name": "Keck Graduate Institute of Applied Life Sciences",
    "lat": 34.092479,
    "lon": -117.722006,
    "terminated_loss": 1050053,
    "terminated_num": 1,
    "terminated_loss_noself": 1050053,
    "terminated_num_noself": 1
}, {
    "org_name": "California Polytechnic State University, San Luis Obispo",
    "lat": 35.299317,
    "lon": -120.656618,
    "terminated_loss": 141319,
    "terminated_num": 1,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "Wake Forest University Health Sciences",
    "lat": 36.059402,
    "lon": -80.321981,
    "terminated_loss": 2021976,
    "terminated_num": 2,
    "terminated_loss_noself": 2021976,
    "terminated_num_noself": 2
}, {
    "org_name": "Virginia Polytechnic Institute and State University",
    "lat": 37.233061,
    "lon": -80.421005,
    "terminated_loss": 5250625,
    "terminated_num": 3,
    "terminated_loss_noself": 5250625,
    "terminated_num_noself": 3
}, {
    "org_name": "WETA TV 26",
    "lat": 38.84087,
    "lon": -77.086486,
    "terminated_loss": 65169,
    "terminated_num": 1,
    "terminated_loss_noself": 65169,
    "terminated_num_noself": 1
}, {
    "org_name": "Indiana University",
    "lat": 39.172055,
    "lon": -86.523157,
    "terminated_loss": 46838,
    "terminated_num": 1,
    "terminated_loss_noself": 46838,
    "terminated_num_noself": 1
}, {
    "org_name": "Rutgers, Camden",
    "lat": 39.947479,
    "lon": -75.123053,
    "terminated_loss": 175867,
    "terminated_num": 1,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "The Research Institute at Nationwide Children's Hospital",
    "lat": 39.95251,
    "lon": -82.979302,
    "terminated_loss": 1007060,
    "terminated_num": 1,
    "terminated_loss_noself": 1007060,
    "terminated_num_noself": 1
}, {
    "org_name": "Rutgers, Newark",
    "lat": 40.740542,
    "lon": -74.172677,
    "terminated_loss": 187723,
    "terminated_num": 1,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "NDRI-USA, Inc.",
    "lat": 40.74287,
    "lon": -73.992333,
    "terminated_loss": 307959,
    "terminated_num": 1,
    "terminated_loss_noself": 307959,
    "terminated_num_noself": 1
}, {
    "org_name": "Weill Medical College of Cornell University",
    "lat": 40.7607,
    "lon": -73.9603,
    "terminated_loss": 19624763,
    "terminated_num": 1,
    "terminated_loss_noself": 19624763,
    "terminated_num_noself": 1
}, {
    "org_name": "The Research Foundation for Mental Hygiene, Inc.",
    "lat": 40.843076,
    "lon": -73.944206,
    "terminated_loss": 2746069,
    "terminated_num": 5,
    "terminated_loss_noself": 2746069,
    "terminated_num_noself": 4
}, {
    "org_name": "Pennsylvania State University",
    "lat": 40.870717,
    "lon": -77.83415,
    "terminated_loss": 134263,
    "terminated_num": 1,
    "terminated_loss_noself": 134263,
    "terminated_num_noself": 1
}, {
    "org_name": "Butler Hospital",
    "lat": 41.843586,
    "lon": -71.379656,
    "terminated_loss": 103572,
    "terminated_num": 1,
    "terminated_loss_noself": 103572,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Massachusetts Medical School Worcester",
    "lat": 42.2802,
    "lon": -71.758245,
    "terminated_loss": 102036,
    "terminated_num": 3,
    "terminated_loss_noself": 102036,
    "terminated_num_noself": 3
}, {
    "org_name": "Rosalind Franklin University of Medicine & Science",
    "lat": 42.302294,
    "lon": -87.861378,
    "terminated_loss": 476023,
    "terminated_num": 1,
    "terminated_loss_noself": 476023,
    "terminated_num_noself": 1
}, {
    "org_name": "Function Promoting Therapies, LLC",
    "lat": 42.33724,
    "lon": -71.10217,
    "terminated_loss": 2320467,
    "terminated_num": 1,
    "terminated_loss_noself": 2320467,
    "terminated_num_noself": 1
}, {
    "org_name": "Henry Ford Health and Michigan State University Health Sciences",
    "lat": 42.653979,
    "lon": -84.492032,
    "terminated_loss": 743448,
    "terminated_num": 1,
    "terminated_loss_noself": 743448,
    "terminated_num_noself": 1
}, {
    "org_name": "Van Andel Research Institute",
    "lat": 42.969389,
    "lon": -85.666402,
    "terminated_loss": 105649,
    "terminated_num": 1,
    "terminated_loss_noself": 105649,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Vermont and State Agricultural College",
    "lat": 44.478282,
    "lon": -73.201079,
    "terminated_loss": 5130709,
    "terminated_num": 1,
    "terminated_loss_noself": 5130709,
    "terminated_num_noself": 1
}, {
    "org_name": "Boston University",
    "lat": 42.33639,
    "lon": -71.07097,
    "terminated_loss": 1855033,
    "terminated_num": 4,
    "terminated_loss_noself": 1855033,
    "terminated_num_noself": 4
}, {
    "org_name": "Tufts University",
    "lat": 42.3498,
    "lon": -71.06149,
    "terminated_loss": 1122319,
    "terminated_num": 2,
    "terminated_loss_noself": 1122319,
    "terminated_num_noself": 2
}, {
    "org_name": "Columbia University",
    "lat": 40.8415,
    "lon": -73.9414,
    "terminated_loss": 495391014,
    "terminated_num": 168,
    "terminated_loss_noself": 490263274,
    "terminated_num_noself": 156
}, {
    "org_name": "University of Miami",
    "lat": 25.713468,
    "lon": -80.277246,
    "terminated_loss": 5393248,
    "terminated_num": 12,
    "terminated_loss_noself": 5393248,
    "terminated_num_noself": 12
}, {
    "org_name": "University of Hawaii at Manoa",
    "lat": 21.299198,
    "lon": -157.820371,
    "terminated_loss": 24991709,
    "terminated_num": 2,
    "terminated_loss_noself": 24991709,
    "terminated_num_noself": 2
}, {
    "org_name": "Florida International University",
    "lat": 25.761055,
    "lon": -80.376195,
    "terminated_loss": 20171821,
    "terminated_num": 3,
    "terminated_loss_noself": 20171821,
    "terminated_num_noself": 3
}, {
    "org_name": "Nova Southeastern University",
    "lat": 26.07761,
    "lon": -80.242565,
    "terminated_loss": 58463,
    "terminated_num": 1,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "University of Central Florida",
    "lat": 28.601027,
    "lon": -81.197266,
    "terminated_loss": 3295357,
    "terminated_num": 4,
    "terminated_loss_noself": 3295357,
    "terminated_num_noself": 4
}, {
    "org_name": "St. Mary's University",
    "lat": 29.451933,
    "lon": -98.560605,
    "terminated_loss": 90808,
    "terminated_num": 1,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "University of Texas San Antonio",
    "lat": 29.567119,
    "lon": -98.605723,
    "terminated_loss": 492768,
    "terminated_num": 1,
    "terminated_loss_noself": 492768,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Florida",
    "lat": 29.643443,
    "lon": -82.349637,
    "terminated_loss": 732966,
    "terminated_num": 1,
    "terminated_loss_noself": 732966,
    "terminated_num_noself": 1
}, {
    "org_name": "Baylor College of Medicine",
    "lat": 29.70926,
    "lon": -95.400851,
    "terminated_loss": 5355163,
    "terminated_num": 3,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "University of Houston",
    "lat": 29.718091,
    "lon": -95.336483,
    "terminated_loss": 26394,
    "terminated_num": 1,
    "terminated_loss_noself": 26394,
    "terminated_num_noself": 1
}, {
    "org_name": "Texas State University",
    "lat": 29.888774,
    "lon": -97.937445,
    "terminated_loss": 729745,
    "terminated_num": 2,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "Tulane University of Louisiana",
    "lat": 29.935429,
    "lon": -90.12279,
    "terminated_loss": 6317602,
    "terminated_num": 3,
    "terminated_loss_noself": 6317602,
    "terminated_num_noself": 3
}, {
    "org_name": "University of Texas at Austin",
    "lat": 30.291188,
    "lon": -97.737568,
    "terminated_loss": 1797000,
    "terminated_num": 2,
    "terminated_loss_noself": 1325627,
    "terminated_num_noself": 1
}, {
    "org_name": "Louisiana State University A&M College Baton Rouge",
    "lat": 30.408018,
    "lon": -91.188669,
    "terminated_loss": 223951,
    "terminated_num": 1,
    "terminated_loss_noself": 223951,
    "terminated_num_noself": 1
}, {
    "org_name": "Florida State University",
    "lat": 30.441455,
    "lon": -84.297889,
    "terminated_loss": 25941086,
    "terminated_num": 7,
    "terminated_loss_noself": 25941086,
    "terminated_num_noself": 7
}, {
    "org_name": "University of Texas El Paso",
    "lat": 31.770518,
    "lon": -106.504149,
    "terminated_loss": 3681291,
    "terminated_num": 2,
    "terminated_loss_noself": 3195599,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Arizona",
    "lat": 32.232844,
    "lon": -110.959467,
    "terminated_loss": 403597,
    "terminated_num": 1,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "University of Mississippi Medical Center",
    "lat": 32.328724,
    "lon": -90.175537,
    "terminated_loss": 807258,
    "terminated_num": 2,
    "terminated_loss_noself": 807258,
    "terminated_num_noself": 2
}, {
    "org_name": "Auburn University at Auburn",
    "lat": 32.602139,
    "lon": -85.508496,
    "terminated_loss": 704546,
    "terminated_num": 1,
    "terminated_loss_noself": 704546,
    "terminated_num_noself": 1
}, {
    "org_name": "University of North Texas Health Science Center",
    "lat": 32.749542,
    "lon": -97.36903,
    "terminated_loss": 10000000,
    "terminated_num": 1,
    "terminated_loss_noself": 10000000,
    "terminated_num_noself": 1
}, {
    "org_name": "San Diego State University",
    "lat": 32.762178,
    "lon": -117.069156,
    "terminated_loss": 9909355,
    "terminated_num": 7,
    "terminated_loss_noself": 9693484,
    "terminated_num_noself": 6
}, {
    "org_name": "Medical University of South Carolina",
    "lat": 32.786754,
    "lon": -79.947265,
    "terminated_loss": 554948,
    "terminated_num": 1,
    "terminated_loss_noself": 554948,
    "terminated_num_noself": 1
}, {
    "org_name": "La Jolla Institute for Immunology",
    "lat": 32.838775,
    "lon": -117.253243,
    "terminated_loss": 5324218,
    "terminated_num": 2,
    "terminated_loss_noself": 5324218,
    "terminated_num_noself": 2
}, {
    "org_name": "University of California, San Diego",
    "lat": 32.876991,
    "lon": -117.24087,
    "terminated_loss": 8142727,
    "terminated_num": 4,
    "terminated_loss_noself": 8142727,
    "terminated_num_noself": 4
}, {
    "org_name": "Scripps Research Institute, the",
    "lat": 32.903062,
    "lon": -117.243592,
    "terminated_loss": 13394989,
    "terminated_num": 1,
    "terminated_loss_noself": 13394989,
    "terminated_num_noself": 1
}, {
    "org_name": "Arizona State University-Tempe Campus",
    "lat": 33.423954,
    "lon": -111.940687,
    "terminated_loss": 776497,
    "terminated_num": 2,
    "terminated_loss_noself": 776497,
    "terminated_num_noself": 2
}, {
    "org_name": "Center for Innovative Public Health Research",
    "lat": 33.430039,
    "lon": -117.616549,
    "terminated_loss": 2610840,
    "terminated_num": 3,
    "terminated_loss_noself": 2610840,
    "terminated_num_noself": 3
}, {
    "org_name": "Banner Health",
    "lat": 33.433422,
    "lon": -112.087594,
    "terminated_loss": 3886206,
    "terminated_num": 1,
    "terminated_loss_noself": 3886206,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Alabama at Birmingham",
    "lat": 33.50591,
    "lon": -86.799772,
    "terminated_loss": 9948119,
    "terminated_num": 7,
    "terminated_loss_noself": 9944949,
    "terminated_num_noself": 6
}, {
    "org_name": "Texas Tech University",
    "lat": 33.584696,
    "lon": -101.872767,
    "terminated_loss": 211115,
    "terminated_num": 1,
    "terminated_loss_noself": 211115,
    "terminated_num_noself": 1
}, {
    "org_name": "University of California-Irvine",
    "lat": 33.64852,
    "lon": -117.82136,
    "terminated_loss": 1241682,
    "terminated_num": 4,
    "terminated_loss_noself": 1241682,
    "terminated_num_noself": 3
}, {
    "org_name": "Spelman College",
    "lat": 33.745247,
    "lon": -84.411462,
    "terminated_loss": 4854705,
    "terminated_num": 2,
    "terminated_loss_noself": 4854705,
    "terminated_num_noself": 1
}, {
    "org_name": "Morehouse School of Medicine",
    "lat": 33.746607,
    "lon": -84.414781,
    "terminated_loss": 4282843,
    "terminated_num": 2,
    "terminated_loss_noself": 1619792,
    "terminated_num_noself": 1
}, {
    "org_name": "Georgia State University",
    "lat": 33.753531,
    "lon": -84.384483,
    "terminated_loss": 534643,
    "terminated_num": 2,
    "terminated_loss_noself": 459283,
    "terminated_num_noself": 1
}, {
    "org_name": "Emory University",
    "lat": 33.791247,
    "lon": -84.3249,
    "terminated_loss": 85110194,
    "terminated_num": 17,
    "terminated_loss_noself": 84249951,
    "terminated_num_noself": 14
}, {
    "org_name": "California State University Fullerton",
    "lat": 33.8781,
    "lon": -117.884245,
    "terminated_loss": 290915,
    "terminated_num": 1,
    "terminated_loss_noself": 290915,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Georgia",
    "lat": 33.931173,
    "lon": -83.378873,
    "terminated_loss": 2768181,
    "terminated_num": 1,
    "terminated_loss_noself": 2768181,
    "terminated_num_noself": 1
}, {
    "org_name": "Loyola Marymount University",
    "lat": 33.969677,
    "lon": -118.416139,
    "terminated_loss": 509239,
    "terminated_num": 1,
    "terminated_loss_noself": 509239,
    "terminated_num_noself": 1
}, {
    "org_name": "University of South Carolina at Columbia",
    "lat": 33.999623,
    "lon": -81.028249,
    "terminated_loss": 6082130,
    "terminated_num": 3,
    "terminated_loss_noself": 6082130,
    "terminated_num_noself": 3
}, {
    "org_name": "Rand Corporation",
    "lat": 34.009659,
    "lon": -118.490943,
    "terminated_loss": 5016547,
    "terminated_num": 4,
    "terminated_loss_noself": 5016547,
    "terminated_num_noself": 4
}, {
    "org_name": "University of Southern California",
    "lat": 34.017282,
    "lon": -118.281254,
    "terminated_loss": 218830,
    "terminated_num": 1,
    "terminated_loss_noself": 218830,
    "terminated_num_noself": 1
}, {
    "org_name": "Public Health Foundation Enterprises",
    "lat": 34.029482,
    "lon": -118.023269,
    "terminated_loss": 2201105,
    "terminated_num": 4,
    "terminated_loss_noself": 2201105,
    "terminated_num_noself": 4
}, {
    "org_name": "Kennesaw State University",
    "lat": 34.034315,
    "lon": -84.574275,
    "terminated_loss": 327856,
    "terminated_num": 1,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "University of California Los Angeles",
    "lat": 34.070199,
    "lon": -118.45102,
    "terminated_loss": 2861503,
    "terminated_num": 4,
    "terminated_loss_noself": 2861503,
    "terminated_num_noself": 4
}, {
    "org_name": "Cedars-Sinai Medical Center",
    "lat": 34.076544,
    "lon": -118.380004,
    "terminated_loss": 1583259,
    "terminated_num": 1,
    "terminated_loss_noself": 1583259,
    "terminated_num_noself": 1
}, {
    "org_name": "Children's Hospital of Los Angeles",
    "lat": 34.098065,
    "lon": -118.29069,
    "terminated_loss": 12656384,
    "terminated_num": 1,
    "terminated_loss_noself": 12656384,
    "terminated_num_noself": 1
}, {
    "org_name": "California State University Northridge",
    "lat": 34.245875,
    "lon": -118.501885,
    "terminated_loss": 175254,
    "terminated_num": 1,
    "terminated_loss_noself": 175254,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Mississippi",
    "lat": 34.36739,
    "lon": -89.528956,
    "terminated_loss": 100956,
    "terminated_num": 1,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "University of California Santa Barbara",
    "lat": 34.431306,
    "lon": -119.834277,
    "terminated_loss": 443045,
    "terminated_num": 2,
    "terminated_loss_noself": 443045,
    "terminated_num_noself": 2
}, {
    "org_name": "University of North Carolina at Pembroke",
    "lat": 34.694134,
    "lon": -79.198114,
    "terminated_loss": 99598,
    "terminated_num": 1,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "University of Arkansas for Medical Sciences",
    "lat": 34.749005,
    "lon": -92.320097,
    "terminated_loss": 1054137,
    "terminated_num": 1,
    "terminated_loss_noself": 1054137,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Tennessee Chattanooga",
    "lat": 35.045822,
    "lon": -85.299815,
    "terminated_loss": 224753,
    "terminated_num": 1,
    "terminated_loss_noself": 224753,
    "terminated_num_noself": 1
}, {
    "org_name": "University of New Mexico",
    "lat": 35.090226,
    "lon": -106.625292,
    "terminated_loss": 7312808,
    "terminated_num": 1,
    "terminated_loss_noself": 7312808,
    "terminated_num_noself": 1
}, {
    "org_name": "University of New Mexico Health Sciences Center",
    "lat": 35.090968,
    "lon": -106.617544,
    "terminated_loss": 11567156,
    "terminated_num": 2,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "University of Memphis",
    "lat": 35.120123,
    "lon": -89.939705,
    "terminated_loss": 9626,
    "terminated_num": 1,
    "terminated_loss_noself": 9626,
    "terminated_num_noself": 1
}, {
    "org_name": "University of North Carolina Charlotte",
    "lat": 35.301652,
    "lon": -80.731452,
    "terminated_loss": 784594,
    "terminated_num": 2,
    "terminated_loss_noself": 784594,
    "terminated_num_noself": 2
}, {
    "org_name": "University of Oklahoma Health Sciences Center",
    "lat": 35.47459,
    "lon": -97.505034,
    "terminated_loss": 1161494,
    "terminated_num": 4,
    "terminated_loss_noself": 1161494,
    "terminated_num_noself": 3
}, {
    "org_name": "Cherokee Nation",
    "lat": 35.85318,
    "lon": -94.99067,
    "terminated_loss": 5001848,
    "terminated_num": 2,
    "terminated_loss_noself": 5001848,
    "terminated_num_noself": 2
}, {
    "org_name": "Research Triangle Institute",
    "lat": 35.9138,
    "lon": -78.848911,
    "terminated_loss": 2897104,
    "terminated_num": 1,
    "terminated_loss_noself": 2897104,
    "terminated_num_noself": 1
}, {
    "org_name": "University of North Carolina Chapel Hill",
    "lat": 35.9316,
    "lon": -79.057377,
    "terminated_loss": 35382909,
    "terminated_num": 14,
    "terminated_loss_noself": 29951313,
    "terminated_num_noself": 12
}, {
    "org_name": "University of Tennessee Knoxville",
    "lat": 35.954943,
    "lon": -83.93035,
    "terminated_loss": 14549,
    "terminated_num": 1,
    "terminated_loss_noself": 14549,
    "terminated_num_noself": 1
}, {
    "org_name": "Innovation Research and Training, Inc.",
    "lat": 35.964557,
    "lon": -78.940527,
    "terminated_loss": 114999,
    "terminated_num": 1,
    "terminated_loss_noself": 114999,
    "terminated_num_noself": 1
}, {
    "org_name": "Family Health International",
    "lat": 35.992834,
    "lon": -78.903914,
    "terminated_loss": 437174682,
    "terminated_num": 1,
    "terminated_loss_noself": 437174682,
    "terminated_num_noself": 1
}, {
    "org_name": "Duke University",
    "lat": 36.007766,
    "lon": -78.926475,
    "terminated_loss": 154037454,
    "terminated_num": 6,
    "terminated_loss_noself": 153099057,
    "terminated_num_noself": 5
}, {
    "org_name": "University of Nevada Las Vegas",
    "lat": 36.109517,
    "lon": -115.141947,
    "terminated_loss": 981566,
    "terminated_num": 2,
    "terminated_loss_noself": 981566,
    "terminated_num_noself": 2
}, {
    "org_name": "Oklahoma State University Stillwater",
    "lat": 36.115627,
    "lon": -97.058038,
    "terminated_loss": 315498,
    "terminated_num": 1,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "Vanderbilt University",
    "lat": 36.143381,
    "lon": -86.803365,
    "terminated_loss": 6227653,
    "terminated_num": 6,
    "terminated_loss_noself": 6227653,
    "terminated_num_noself": 4
}, {
    "org_name": "Meharry Medical College",
    "lat": 36.166904,
    "lon": -86.806149,
    "terminated_loss": 25483155,
    "terminated_num": 2,
    "terminated_loss_noself": 25483155,
    "terminated_num_noself": 2
}, {
    "org_name": "University of California Santa Cruz",
    "lat": 36.97756,
    "lon": -122.055836,
    "terminated_loss": 3387402,
    "terminated_num": 2,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "San Jose State University",
    "lat": 37.340938,
    "lon": -121.889413,
    "terminated_loss": 96159,
    "terminated_num": 1,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "Stanford University",
    "lat": 37.426852,
    "lon": -122.17047,
    "terminated_loss": 36667854,
    "terminated_num": 7,
    "terminated_loss_noself": 35965362,
    "terminated_num_noself": 5
}, {
    "org_name": "Genendeavor, LLC",
    "lat": 37.52099,
    "lon": -121.948289,
    "terminated_loss": 270078,
    "terminated_num": 1,
    "terminated_loss_noself": 270078,
    "terminated_num_noself": 1
}, {
    "org_name": "Virginia Commonwealth University",
    "lat": 37.549807,
    "lon": -77.452775,
    "terminated_loss": 7669,
    "terminated_num": 2,
    "terminated_loss_noself": 7669,
    "terminated_num_noself": 1
}, {
    "org_name": "San Francisco State University",
    "lat": 37.72091,
    "lon": -122.476074,
    "terminated_loss": 1194713,
    "terminated_num": 2,
    "terminated_loss_noself": 1194713,
    "terminated_num_noself": 2
}, {
    "org_name": "University of California, San Francisco",
    "lat": 37.767442,
    "lon": -122.413937,
    "terminated_loss": 33407648,
    "terminated_num": 17,
    "terminated_loss_noself": 31231989,
    "terminated_num_noself": 14
}, {
    "org_name": "University of San Francisco",
    "lat": 37.775292,
    "lon": -122.451727,
    "terminated_loss": 555385,
    "terminated_num": 2,
    "terminated_loss_noself": 555385,
    "terminated_num_noself": 1
}, {
    "org_name": "Kaiser Foundation Research Institute",
    "lat": 37.805769,
    "lon": -122.265214,
    "terminated_loss": 1217017,
    "terminated_num": 1,
    "terminated_loss_noself": 1217017,
    "terminated_num_noself": 1
}, {
    "org_name": "University of California Berkeley",
    "lat": 37.870017,
    "lon": -122.268624,
    "terminated_loss": 46201,
    "terminated_num": 1,
    "terminated_loss_noself": 46201,
    "terminated_num_noself": 1
}, {
    "org_name": "University of the Pacific-Stockton",
    "lat": 37.984345,
    "lon": -121.309964,
    "terminated_loss": 429842,
    "terminated_num": 1,
    "terminated_loss_noself": 429842,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Kentucky",
    "lat": 38.040959,
    "lon": -84.505885,
    "terminated_loss": 740004,
    "terminated_num": 2,
    "terminated_loss_noself": 740004,
    "terminated_num_noself": 2
}, {
    "org_name": "University of Virginia",
    "lat": 38.050527,
    "lon": -78.500531,
    "terminated_loss": 23948237,
    "terminated_num": 2,
    "terminated_loss_noself": 23339678,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Louisville",
    "lat": 38.215024,
    "lon": -85.760145,
    "terminated_loss": 2096359,
    "terminated_num": 2,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "Neurovations",
    "lat": 38.325376,
    "lon": -122.291992,
    "terminated_loss": 4347499,
    "terminated_num": 1,
    "terminated_loss_noself": 4347499,
    "terminated_num_noself": 1
}, {
    "org_name": "University of California at Davis",
    "lat": 38.543366,
    "lon": -121.72946,
    "terminated_loss": 12301466,
    "terminated_num": 2,
    "terminated_loss_noself": 12301466,
    "terminated_num_noself": 2
}, {
    "org_name": "Washington University",
    "lat": 38.664368,
    "lon": -90.323797,
    "terminated_loss": 2512555,
    "terminated_num": 4,
    "terminated_loss_noself": 1426634,
    "terminated_num_noself": 3
}, {
    "org_name": "University of Colorado",
    "lat": 38.891282,
    "lon": -104.800059,
    "terminated_loss": 443260,
    "terminated_num": 1,
    "terminated_loss_noself": 443260,
    "terminated_num_noself": 1
}, {
    "org_name": "George Washington University",
    "lat": 38.898075,
    "lon": -77.043933,
    "terminated_loss": 4108441,
    "terminated_num": 5,
    "terminated_loss_noself": 4108441,
    "terminated_num_noself": 5
}, {
    "org_name": "Gerontological Society of America",
    "lat": 38.903389,
    "lon": -77.029146,
    "terminated_loss": 1043971,
    "terminated_num": 1,
    "terminated_loss_noself": 1043971,
    "terminated_num_noself": 1
}, {
    "org_name": "Whitman-Walker Institute, Inc.",
    "lat": 38.9127,
    "lon": -77.031423,
    "terminated_loss": 1532011,
    "terminated_num": 2,
    "terminated_loss_noself": 1532011,
    "terminated_num_noself": 2
}, {
    "org_name": "Children's Research Institute",
    "lat": 38.927274,
    "lon": -77.014396,
    "terminated_loss": 873238,
    "terminated_num": 2,
    "terminated_loss_noself": 873238,
    "terminated_num_noself": 2
}, {
    "org_name": "Us Helping Us, People Into Living, Inc.",
    "lat": 38.935098,
    "lon": -77.024402,
    "terminated_loss": 114194,
    "terminated_num": 1,
    "terminated_loss_noself": 114194,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Maryland, College Park",
    "lat": 38.992333,
    "lon": -76.952986,
    "terminated_loss": 803391,
    "terminated_num": 3,
    "terminated_loss_noself": 803391,
    "terminated_num_noself": 3
}, {
    "org_name": "University of Missouri Kansas City",
    "lat": 39.034521,
    "lon": -94.575773,
    "terminated_loss": 955304,
    "terminated_num": 1,
    "terminated_loss_noself": 955304,
    "terminated_num_noself": 1
}, {
    "org_name": "Pacific Institute for Research and Evaluation",
    "lat": 39.050676,
    "lon": -76.93727,
    "terminated_loss": 1298293,
    "terminated_num": 2,
    "terminated_loss_noself": 1298293,
    "terminated_num_noself": 2
}, {
    "org_name": "Westat, Inc.",
    "lat": 39.094626,
    "lon": -77.181453,
    "terminated_loss": 10317273,
    "terminated_num": 2,
    "terminated_loss_noself": 10317273,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Cincinnati",
    "lat": 39.129719,
    "lon": -84.520554,
    "terminated_loss": 3116272,
    "terminated_num": 3,
    "terminated_loss_noself": 3116272,
    "terminated_num_noself": 3
}, {
    "org_name": "University of Maryland Baltimore",
    "lat": 39.292248,
    "lon": -76.625629,
    "terminated_loss": 13758647,
    "terminated_num": 8,
    "terminated_loss_noself": 13758647,
    "terminated_num_noself": 8
}, {
    "org_name": "Friends Research Institute, Inc.",
    "lat": 39.303676,
    "lon": -76.619888,
    "terminated_loss": 1419942,
    "terminated_num": 2,
    "terminated_loss_noself": 1419942,
    "terminated_num_noself": 2
}, {
    "org_name": "Johns Hopkins University",
    "lat": 39.325256,
    "lon": -76.605131,
    "terminated_loss": 18031310,
    "terminated_num": 22,
    "terminated_loss_noself": 18005488,
    "terminated_num_noself": 21
}, {
    "org_name": "University of Nevada Reno",
    "lat": 39.545077,
    "lon": -119.818277,
    "terminated_loss": 107144,
    "terminated_num": 1,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "University of Denver (Colorado Seminary)",
    "lat": 39.676639,
    "lon": -104.959481,
    "terminated_loss": 995920,
    "terminated_num": 1,
    "terminated_loss_noself": 995920,
    "terminated_num_noself": 1
}, {
    "org_name": "Denver Health and Hospital Authority",
    "lat": 39.727302,
    "lon": -104.991569,
    "terminated_loss": 138990,
    "terminated_num": 1,
    "terminated_loss_noself": 138990,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Colorado Denver",
    "lat": 39.745098,
    "lon": -104.837605,
    "terminated_loss": 2424428,
    "terminated_num": 8,
    "terminated_loss_noself": 1438098,
    "terminated_num_noself": 6
}, {
    "org_name": "Children's Hospital of Philadelphia",
    "lat": 39.946632,
    "lon": -75.196604,
    "terminated_loss": 999049,
    "terminated_num": 2,
    "terminated_loss_noself": 999049,
    "terminated_num_noself": 2
}, {
    "org_name": "University of Pennsylvania",
    "lat": 39.953462,
    "lon": -75.193983,
    "terminated_loss": 3869811,
    "terminated_num": 6,
    "terminated_loss_noself": 3869811,
    "terminated_num_noself": 6
}, {
    "org_name": "Drexel University",
    "lat": 39.954073,
    "lon": -75.186541,
    "terminated_loss": 8701441,
    "terminated_num": 3,
    "terminated_loss_noself": 8701441,
    "terminated_num_noself": 3
}, {
    "org_name": "Temple University of the Commonwealth",
    "lat": 39.980272,
    "lon": -75.157051,
    "terminated_loss": 600503,
    "terminated_num": 3,
    "terminated_loss_noself": 600503,
    "terminated_num_noself": 3
}, {
    "org_name": "Ohio State University",
    "lat": 39.999598,
    "lon": -83.033131,
    "terminated_loss": 5190229,
    "terminated_num": 9,
    "terminated_loss_noself": 5190229,
    "terminated_num_noself": 8
}, {
    "org_name": "University of Illinois at Urbana-Champaign",
    "lat": 40.116857,
    "lon": -88.228755,
    "terminated_loss": 54656,
    "terminated_num": 1,
    "terminated_loss_noself": 54656,
    "terminated_num_noself": 1
}, {
    "org_name": "Pennsylvania State University Hershey Medical Center",
    "lat": 40.264414,
    "lon": -76.674014,
    "terminated_loss": 518498,
    "terminated_num": 1,
    "terminated_loss_noself": 518498,
    "terminated_num_noself": 1
}, {
    "org_name": "Princeton University",
    "lat": 40.345441,
    "lon": -74.655866,
    "terminated_loss": 1696025,
    "terminated_num": 3,
    "terminated_loss_noself": 1664755,
    "terminated_num_noself": 2
}, {
    "org_name": "Purdue University",
    "lat": 40.41872,
    "lon": -86.910361,
    "terminated_loss": 478420,
    "terminated_num": 1,
    "terminated_loss_noself": 478420,
    "terminated_num_noself": 1
}, {
    "org_name": "Duquesne University",
    "lat": 40.437818,
    "lon": -79.993649,
    "terminated_loss": 869170,
    "terminated_num": 1,
    "terminated_loss_noself": 869170,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Pittsburgh at Pittsburgh",
    "lat": 40.440909,
    "lon": -79.959125,
    "terminated_loss": 5123753,
    "terminated_num": 12,
    "terminated_loss_noself": 4884194,
    "terminated_num_noself": 10
}, {
    "org_name": "Rutgers Biomedical and Health Sciences",
    "lat": 40.520984,
    "lon": -74.473247,
    "terminated_loss": 3530761,
    "terminated_num": 5,
    "terminated_loss_noself": 3530761,
    "terminated_num_noself": 5
}, {
    "org_name": "Brooklyn College",
    "lat": 40.631637,
    "lon": -73.952868,
    "terminated_loss": 102172,
    "terminated_num": 1,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "New York University School of Medicine",
    "lat": 40.669895,
    "lon": -73.974354,
    "terminated_loss": 532596,
    "terminated_num": 2,
    "terminated_loss_noself": 532596,
    "terminated_num_noself": 1
}, {
    "org_name": "New York University",
    "lat": 40.729659,
    "lon": -73.997018,
    "terminated_loss": 759251,
    "terminated_num": 3,
    "terminated_loss_noself": 759251,
    "terminated_num_noself": 2
}, {
    "org_name": "New School University",
    "lat": 40.735382,
    "lon": -73.997241,
    "terminated_loss": 41181,
    "terminated_num": 1,
    "terminated_loss_noself": 41181,
    "terminated_num_noself": 1
}, {
    "org_name": "Queens College",
    "lat": 40.735855,
    "lon": -73.815751,
    "terminated_loss": 132877,
    "terminated_num": 1,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "Ecohealth Alliance, Inc.",
    "lat": 40.754061,
    "lon": -73.998951,
    "terminated_loss": 5716314,
    "terminated_num": 4,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "Sloan-Kettering Inst Can Research",
    "lat": 40.764045,
    "lon": -73.956024,
    "terminated_loss": 23851549,
    "terminated_num": 1,
    "terminated_loss_noself": 23851549,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Utah",
    "lat": 40.764542,
    "lon": -111.850317,
    "terminated_loss": 1482900,
    "terminated_num": 2,
    "terminated_loss_noself": 1482900,
    "terminated_num_noself": 2
}, {
    "org_name": "New York Blood Center",
    "lat": 40.76519,
    "lon": -73.959922,
    "terminated_loss": 165822,
    "terminated_num": 2,
    "terminated_loss_noself": 165822,
    "terminated_num_noself": 1
}, {
    "org_name": "Hunter College",
    "lat": 40.768737,
    "lon": -73.965182,
    "terminated_loss": 270694,
    "terminated_num": 3,
    "terminated_loss_noself": 270694,
    "terminated_num_noself": 3
}, {
    "org_name": "Icahn School of Medicine at Mount Sinai",
    "lat": 40.790284,
    "lon": -73.946781,
    "terminated_loss": 12885621,
    "terminated_num": 7,
    "terminated_loss_noself": 11879988,
    "terminated_num_noself": 5
}, {
    "org_name": "City College of New York",
    "lat": 40.819407,
    "lon": -73.950169,
    "terminated_loss": 130948,
    "terminated_num": 1,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "University of Nebraska Lincoln",
    "lat": 40.823017,
    "lon": -96.673442,
    "terminated_loss": 844814,
    "terminated_num": 4,
    "terminated_loss_noself": 844814,
    "terminated_num_noself": 4
}, {
    "org_name": "Albert Einstein College of Medicine",
    "lat": 40.85103,
    "lon": -73.844379,
    "terminated_loss": 866537,
    "terminated_num": 1,
    "terminated_loss_noself": 866537,
    "terminated_num_noself": 1
}, {
    "org_name": "Hackensack University Medical Center",
    "lat": 40.883415,
    "lon": -74.055652,
    "terminated_loss": 16025697,
    "terminated_num": 2,
    "terminated_loss_noself": 16025697,
    "terminated_num_noself": 2
}, {
    "org_name": "State University New York Stony Brook",
    "lat": 40.914561,
    "lon": -73.125169,
    "terminated_loss": 2815133,
    "terminated_num": 1,
    "terminated_loss_noself": 2815133,
    "terminated_num_noself": 1
}, {
    "org_name": "Silverbills Inc.",
    "lat": 40.946852,
    "lon": -73.772045,
    "terminated_loss": 114681,
    "terminated_num": 1,
    "terminated_loss_noself": 114681,
    "terminated_num_noself": 1
}, {
    "org_name": "Yale University",
    "lat": 41.310925,
    "lon": -72.926428,
    "terminated_loss": 11090315,
    "terminated_num": 18,
    "terminated_loss_noself": 10775525,
    "terminated_num_noself": 16
}, {
    "org_name": "Pro-Change Behavior Systems, Inc.",
    "lat": 41.451027,
    "lon": -71.497523,
    "terminated_loss": 87679,
    "terminated_num": 1,
    "terminated_loss_noself": 87679,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Rhode Island",
    "lat": 41.486042,
    "lon": -71.528656,
    "terminated_loss": 901462,
    "terminated_num": 2,
    "terminated_loss_noself": 901462,
    "terminated_num_noself": 2
}, {
    "org_name": "Case Western Reserve University",
    "lat": 41.502739,
    "lon": -81.607334,
    "terminated_loss": 3168378,
    "terminated_num": 5,
    "terminated_loss_noself": 1270403,
    "terminated_num_noself": 2
}, {
    "org_name": "University of Iowa",
    "lat": 41.664405,
    "lon": -91.542152,
    "terminated_loss": 532751,
    "terminated_num": 2,
    "terminated_loss_noself": 532751,
    "terminated_num_noself": 2
}, {
    "org_name": "National Opinion Research Center",
    "lat": 41.785875,
    "lon": -87.597545,
    "terminated_loss": 207652,
    "terminated_num": 1,
    "terminated_loss_noself": 207652,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Chicago",
    "lat": 41.789554,
    "lon": -87.601172,
    "terminated_loss": 7668510,
    "terminated_num": 6,
    "terminated_loss_noself": 7668510,
    "terminated_num_noself": 6
}, {
    "org_name": "Emma Pendleton Bradley Hospital",
    "lat": 41.792379,
    "lon": -71.367401,
    "terminated_loss": 880254,
    "terminated_num": 1,
    "terminated_loss_noself": 880254,
    "terminated_num_noself": 1
}, {
    "org_name": "Resilient Games Studio, LLC",
    "lat": 41.798959,
    "lon": -87.598077,
    "terminated_loss": 84778,
    "terminated_num": 1,
    "terminated_loss_noself": 84778,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Connecticut Storrs",
    "lat": 41.811419,
    "lon": -72.247553,
    "terminated_loss": 1015168,
    "terminated_num": 2,
    "terminated_loss_noself": 1015168,
    "terminated_num_noself": 2
}, {
    "org_name": "Rhode Island Hospital",
    "lat": 41.811681,
    "lon": -71.409371,
    "terminated_loss": 589726,
    "terminated_num": 2,
    "terminated_loss_noself": 589726,
    "terminated_num_noself": 2
}, {
    "org_name": "Brown University",
    "lat": 41.826136,
    "lon": -71.404513,
    "terminated_loss": 2787353,
    "terminated_num": 6,
    "terminated_loss_noself": 2652411,
    "terminated_num_noself": 5
}, {
    "org_name": "Illinois Institute of Technology",
    "lat": 41.831064,
    "lon": -87.629049,
    "terminated_loss": 196612,
    "terminated_num": 1,
    "terminated_loss_noself": 196612,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Illinois at Chicago",
    "lat": 41.871509,
    "lon": -87.667721,
    "terminated_loss": 7715798,
    "terminated_num": 3,
    "terminated_loss_noself": 7715798,
    "terminated_num_noself": 3
}, {
    "org_name": "Rush University Medical Center",
    "lat": 41.87506,
    "lon": -87.668327,
    "terminated_loss": 656646,
    "terminated_num": 1,
    "terminated_loss_noself": 656646,
    "terminated_num_noself": 1
}, {
    "org_name": "Lurie Children's Hospital of Chicago",
    "lat": 41.896663,
    "lon": -87.622919,
    "terminated_loss": 179368,
    "terminated_num": 1,
    "terminated_loss_noself": 179368,
    "terminated_num_noself": 1
}, {
    "org_name": "Northwestern University at Chicago",
    "lat": 42.050479,
    "lon": -87.680046,
    "terminated_loss": 47315682,
    "terminated_num": 15,
    "terminated_loss_noself": 45254479,
    "terminated_num_noself": 12
}, {
    "org_name": "Endeavor Health Clinical Operations",
    "lat": 42.064695,
    "lon": -87.689868,
    "terminated_loss": 1412831,
    "terminated_num": 1,
    "terminated_loss_noself": 1412831,
    "terminated_num_noself": 1
}, {
    "org_name": "Eastern Michigan University",
    "lat": 42.233132,
    "lon": -83.623767,
    "terminated_loss": 1039731,
    "terminated_num": 1,
    "terminated_loss_noself": 1039731,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Michigan at Ann Arbor",
    "lat": 42.275494,
    "lon": -83.743038,
    "terminated_loss": 15380055,
    "terminated_num": 14,
    "terminated_loss_noself": 15380055,
    "terminated_num_noself": 14
}, {
    "org_name": "Harvard Pilgrim Health Care, Inc.",
    "lat": 42.316808,
    "lon": -71.234595,
    "terminated_loss": 3830024,
    "terminated_num": 5,
    "terminated_loss_noself": 3830024,
    "terminated_num_noself": 5
}, {
    "org_name": "Harvard School of Public Health",
    "lat": 42.335306,
    "lon": -71.102775,
    "terminated_loss": 2759335,
    "terminated_num": 2,
    "terminated_loss_noself": 2759335,
    "terminated_num_noself": 2
}, {
    "org_name": "Brigham and Women's Hospital",
    "lat": 42.336107,
    "lon": -71.107481,
    "terminated_loss": 12506156,
    "terminated_num": 5,
    "terminated_loss_noself": 12506156,
    "terminated_num_noself": 5
}, {
    "org_name": "Boston Medical Center",
    "lat": 42.336854,
    "lon": -71.070881,
    "terminated_loss": 202897,
    "terminated_num": 2,
    "terminated_loss_noself": 202897,
    "terminated_num_noself": 2
}, {
    "org_name": "Boston College",
    "lat": 42.336956,
    "lon": -71.170504,
    "terminated_loss": 577852,
    "terminated_num": 2,
    "terminated_loss_noself": 577852,
    "terminated_num_noself": 1
}, {
    "org_name": "Boston Children's Hospital",
    "lat": 42.337481,
    "lon": -71.104964,
    "terminated_loss": 4237254,
    "terminated_num": 5,
    "terminated_loss_noself": 4237254,
    "terminated_num_noself": 5
}, {
    "org_name": "Beth Israel Deaconess Medical Center",
    "lat": 42.33982,
    "lon": -71.10568,
    "terminated_loss": 1207308,
    "terminated_num": 2,
    "terminated_loss_noself": 1207308,
    "terminated_num_noself": 2
}, {
    "org_name": "Northeastern University",
    "lat": 42.340048,
    "lon": -71.088892,
    "terminated_loss": 1297495,
    "terminated_num": 3,
    "terminated_loss_noself": 1297495,
    "terminated_num_noself": 3
}, {
    "org_name": "Fenway Community Health Center",
    "lat": 42.34412,
    "lon": -71.098412,
    "terminated_loss": 411684,
    "terminated_num": 1,
    "terminated_loss_noself": 411684,
    "terminated_num_noself": 1
}, {
    "org_name": "Broad Institute, Inc.",
    "lat": 42.363082,
    "lon": -71.087893,
    "terminated_loss": 3967743,
    "terminated_num": 1,
    "terminated_loss_noself": 3967743,
    "terminated_num_noself": 1
}, {
    "org_name": "Massachusetts General Hospital",
    "lat": 42.363198,
    "lon": -71.068772,
    "terminated_loss": 26117784,
    "terminated_num": 3,
    "terminated_loss_noself": 26117784,
    "terminated_num_noself": 3
}, {
    "org_name": "Harvard University",
    "lat": 42.369697,
    "lon": -71.11193,
    "terminated_loss": 18146,
    "terminated_num": 1,
    "terminated_loss_noself": 18146,
    "terminated_num_noself": 1
}, {
    "org_name": "Ibis Reproductive Health",
    "lat": 42.372813,
    "lon": -71.119098,
    "terminated_loss": 214131,
    "terminated_num": 1,
    "terminated_loss_noself": 214131,
    "terminated_num_noself": 1
}, {
    "org_name": "Cambridge Health Alliance",
    "lat": 42.374417,
    "lon": -71.104436,
    "terminated_loss": 1213358,
    "terminated_num": 1,
    "terminated_loss_noself": 1213358,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Massachusetts Amherst",
    "lat": 42.386914,
    "lon": -72.521131,
    "terminated_loss": 1123743,
    "terminated_num": 1,
    "terminated_loss_noself": 1123743,
    "terminated_num_noself": 1
}, {
    "org_name": "Bentley University",
    "lat": 42.388834,
    "lon": -71.220231,
    "terminated_loss": 6006,
    "terminated_num": 1,
    "terminated_loss_noself": 6006,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Detroit Mercy",
    "lat": 42.417084,
    "lon": -83.138847,
    "terminated_loss": 99781,
    "terminated_num": 1,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "Cornell University",
    "lat": 42.438,
    "lon": -76.4625,
    "terminated_loss": 9209061,
    "terminated_num": 1,
    "terminated_loss_noself": 9209061,
    "terminated_num_noself": 1
}, {
    "org_name": "Wadsworth Center",
    "lat": 42.645888,
    "lon": -73.797658,
    "terminated_loss": 587309,
    "terminated_num": 1,
    "terminated_loss_noself": 587309,
    "terminated_num_noself": 1
}, {
    "org_name": "Michigan State University",
    "lat": 42.653979,
    "lon": -84.492032,
    "terminated_loss": 1243933,
    "terminated_num": 2,
    "terminated_loss_noself": 1243933,
    "terminated_num_noself": 2
}, {
    "org_name": "Roswell Park Cancer Institute Corp",
    "lat": 42.873378,
    "lon": -78.869243,
    "terminated_loss": 63938698,
    "terminated_num": 1,
    "terminated_loss_noself": 63938698,
    "terminated_num_noself": 1
}, {
    "org_name": "State University of New York at Buffalo",
    "lat": 43.003074,
    "lon": -78.785924,
    "terminated_loss": 1419042,
    "terminated_num": 3,
    "terminated_loss_noself": 1419042,
    "terminated_num_noself": 3
}, {
    "org_name": "Marquette University",
    "lat": 43.038728,
    "lon": -87.923307,
    "terminated_loss": 153407,
    "terminated_num": 1,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "Medical College of Wisconsin",
    "lat": 43.04575,
    "lon": -88.020374,
    "terminated_loss": 1144032,
    "terminated_num": 4,
    "terminated_loss_noself": 1144032,
    "terminated_num_noself": 4
}, {
    "org_name": "University of Wisconsin-Madison",
    "lat": 43.068519,
    "lon": -89.400858,
    "terminated_loss": 7524570,
    "terminated_num": 4,
    "terminated_loss_noself": 7524570,
    "terminated_num_noself": 4
}, {
    "org_name": "University of Wisconsin Milwaukee",
    "lat": 43.075704,
    "lon": -87.877999,
    "terminated_loss": 2442601,
    "terminated_num": 3,
    "terminated_loss_noself": 2442601,
    "terminated_num_noself": 3
}, {
    "org_name": "University of Rochester",
    "lat": 43.131774,
    "lon": -77.63546,
    "terminated_loss": 1249501,
    "terminated_num": 5,
    "terminated_loss_noself": 1249501,
    "terminated_num_noself": 5
}, {
    "org_name": "Mainehealth",
    "lat": 43.653164,
    "lon": -70.275471,
    "terminated_loss": 21567108,
    "terminated_num": 1,
    "terminated_loss_noself": 21567108,
    "terminated_num_noself": 1
}, {
    "org_name": "Mayo Clinic Rochester",
    "lat": 44.02432,
    "lon": -92.46011,
    "terminated_loss": -2,
    "terminated_num": 1,
    "terminated_loss_noself": -2,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Oregon",
    "lat": 44.045509,
    "lon": -123.069741,
    "terminated_loss": 6245420,
    "terminated_num": 4,
    "terminated_loss_noself": 5566033,
    "terminated_num_noself": 3
}, {
    "org_name": "Iris Media, Inc.",
    "lat": 44.048722,
    "lon": -123.088476,
    "terminated_loss": 133274,
    "terminated_num": 1,
    "terminated_loss_noself": 133274,
    "terminated_num_noself": 1
}, {
    "org_name": "Healthpartners Institute",
    "lat": 44.85364,
    "lon": -93.225576,
    "terminated_loss": 705873,
    "terminated_num": 2,
    "terminated_loss_noself": 705873,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Minnesota",
    "lat": 44.975143,
    "lon": -93.227003,
    "terminated_loss": 26400315,
    "terminated_num": 10,
    "terminated_loss_noself": 22956141,
    "terminated_num_noself": 9
}, {
    "org_name": "Oregon Health & Science University",
    "lat": 45.49882,
    "lon": -122.685647,
    "terminated_loss": 2108233,
    "terminated_num": 1,
    "terminated_loss_noself": 2108233,
    "terminated_num_noself": 1
}, {
    "org_name": "Montana State University - Bozeman",
    "lat": 45.661963,
    "lon": -111.059937,
    "terminated_loss": 449240,
    "terminated_num": 2,
    "terminated_loss_noself": 449240,
    "terminated_num_noself": 2
}, {
    "org_name": "Washington State University",
    "lat": 46.728892,
    "lon": -117.155742,
    "terminated_loss": 395683,
    "terminated_num": 1,
    "terminated_loss_noself": 395683,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Idaho",
    "lat": 46.730287,
    "lon": -116.996847,
    "terminated_loss": 243448,
    "terminated_num": 1,
    "terminated_loss_noself": 243448,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Montana",
    "lat": 46.860203,
    "lon": -113.983723,
    "terminated_loss": 335036,
    "terminated_num": 1,
    "terminated_loss_noself": 335036,
    "terminated_num_noself": 1
}, {
    "org_name": "Institute for Systems Biology",
    "lat": 47.622538,
    "lon": -122.337533,
    "terminated_loss": 379955,
    "terminated_num": 1,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}, {
    "org_name": "Fred Hutchinson Cancer Center",
    "lat": 47.626482,
    "lon": -122.329606,
    "terminated_loss": 672987886,
    "terminated_num": 4,
    "terminated_loss_noself": 672987886,
    "terminated_num_noself": 4
}, {
    "org_name": "University of Washington",
    "lat": 47.660307,
    "lon": -122.315168,
    "terminated_loss": 3440485,
    "terminated_num": 8,
    "terminated_loss_noself": 3075052,
    "terminated_num_noself": 6
}, {
    "org_name": "Seattle Children's Hospital",
    "lat": 47.66243,
    "lon": -122.282291,
    "terminated_loss": 1027648,
    "terminated_num": 3,
    "terminated_loss_noself": 1027648,
    "terminated_num_noself": 3
}, {
    "org_name": "Southcentral Foundation",
    "lat": 61.182148,
    "lon": -149.795959,
    "terminated_loss": 698946,
    "terminated_num": 1,
    "terminated_loss_noself": 698946,
    "terminated_num_noself": 1
}, {
    "org_name": "University of Alaska Anchorage",
    "lat": 61.190646,
    "lon": -149.818129,
    "terminated_loss": 92557,
    "terminated_num": 1,
    "terminated_loss_noself": 0,
    "terminated_num_noself": 0
}]

export const GRANT_LOSSES: GrantTermination[] = grant_losses_2.flatMap(grant => {
    if (grant.terminated_num > 1) {
        return Array(grant.terminated_num).fill({
            ...grant,
            terminated_loss: grant.terminated_loss / grant.terminated_num
        })
    } else {
        return grant;
    }
})
