import os
import json
import re

def html_to_nodes(html):
    if not html:
        return [{"type": "paragraph", "children": [{"text": ""}]}]
    
    # Normalize br tags to newlines
    html = re.sub(r'<br\s*/?>', '\n', html)
    
    nodes = []
    # Split by double newline for paragraphs
    paragraphs = html.split('\n\n')
    for p in paragraphs:
        p = p.strip()
        if not p:
            continue
        # Replace remaining single newlines with spaces
        p = p.replace('\n', ' ')
        
        children = []
        parts = re.split(r'(<b>|</b>|<strong>|</strong>|<a [^>]+>|</a>)', p)
        
        is_bold = False
        link_url = None
        
        for part in parts:
            if not part:
                continue
            if part in ['<b>', '<strong>']:
                is_bold = True
            elif part in ['</b>', '</strong>']:
                is_bold = False
            elif part.startswith('<a '):
                if 'href="' in part:
                    link_url = part.split('href="')[1].split('"')[0]
                elif "href='" in part:
                    link_url = part.split("href='")[1].split("'")[0]
            elif part == '</a>':
                link_url = None
            else:
                node = {"text": part}
                if is_bold:
                    node["bold"] = True
                
                if link_url:
                    children.append({
                        "type": "link",
                        "href": link_url,
                        "children": [node]
                    })
                else:
                    children.append(node)
        
        if not children:
            children = [{"text": ""}]
            
        nodes.append({
            "type": "paragraph",
            "children": children
        })
        
    if not nodes:
        nodes = [{"type": "paragraph", "children": [{"text": ""}]}]
    return nodes

def write_singleton(name, data, doc_fields, array_doc_fields=None, array_obj_fields=None):
    if array_doc_fields is None: array_doc_fields = []
    if array_obj_fields is None: array_obj_fields = []
    
    path = f'src/content/{name}'
    os.makedirs(path, exist_ok=True)
    
    json_data = {}
    for key, value in data.items():
        if key in doc_fields:
            json_data[key] = html_to_nodes(value)
        elif key in array_doc_fields:
            json_data[key] = [html_to_nodes(item) for item in value]
        elif key in array_obj_fields:
            json_list = []
            for item in value:
                obj_data = {}
                for obj_key, obj_value in item.items():
                    if obj_key == 'content': # hardcoded for learnMore
                        obj_data[obj_key] = html_to_nodes(obj_value)
                    else:
                        obj_data[obj_key] = obj_value
                json_list.append(obj_data)
            json_data[key] = json_list
        else:
            json_data[key] = value
            
    with open(f'{path}/index.json', 'w') as f:
        json.dump(json_data, f, indent=2)

def migrate():
    # Advocacy
    write_singleton('advocacy', {
        "title": "Take Action",
        "headerText": "You can <b>take action</b> to support federal funding for scientific research. Courts across the country and Congress have the power to stop these cuts.",
        "contactCardTitle": "Contact Your Representatives",
        "contactCardText": "We encourage you to <b>contact your local elected officials and representatives</b> in Congress to share your opinion and call attention to these funding cuts. <a href=\"https://www.usa.gov/elected-officials\" target=\"_blank\">Click here to find contact information for your representatives</a>. Here are some facts to keep in mind:",
        "contactCardList": [
            "Less than 1% of the federal budget goes to NIH, but this investment has a big impact.",
            "Federally funded scientific and medical research improves health, drives innovation, creates jobs, and grows the economy.",
            "Every dollar invested in scientific research through NIH produces, on average, $2.56 of economic activity in return – <b>over a 250% gain.</b>",
            "NIH research supports over 400,000 jobs across the U.S.",
            "Reducing indirect cost rates to 15% would undermine the ability of universities, hospitals, and research institutes to conduct life saving, medical research.",
            "Cancelling or freezing grants wastes funds by interrupting ongoing research projects, including active clinical trials, at institutions across the country."
        ],
        "shareCardTitle": "Share the SCIMaP website with friends, family, and followers!",
        "shareCardText": "We also encourage you to share the SCIMaP website with friends, family, and followers. You can learn more about NIH impacts in your state via resources from <a href=\"https://www.unitedformedicalresearch.org/nih-in-your-state/\" target=\"_blank\">United for Medical Research.</a>"
    }, ['headerText', 'contactCardText', 'shareCardText'], ['contactCardList'])

    # About
    write_singleton('about', {
        "title": "Science & Community Impacts Mapping Project (SCIMaP)",
        "mission": "Science transforms our world. However, the process of doing science and the impacts of scientific research are often hidden from view. Through interactive, data-driven visualizations, we aim to help Americans explore how science and health research fuels the economy, supports jobs, and improves health outcomes.<br/><br/>The White House has ordered large cuts to federal funding for scientific research. These changes include a proposal to reduce support for all health-related research nationwide, and cancellations of many grants for specific research projects. We aim to share how these proposed changes impact science, the economy, and healthcare.<br/><br/>Our <a href='https://www.nature.com/articles/s41562-025-02238-x' target='_blank'>recent correspondence piece</a> published in Nature Human Behaviour describes our approach to communicating the impact of these funding cuts nationwide.",
        "team": "We are an interdisciplinary team of researchers from the University of Maryland, College Park (Dr. Joshua Weitz and Dr. Mallory Harris), the University of Pennsylvania (Dr. Alyssa Sinclair, Dr. Emily Falk, and Dr. Danielle Cosme), the University of Utah (Dr. Angela Fagerlin), the Georgia Institute of Technology (Dr. Clio Andris), and University of Oregon (Dr. Ellen Peters). We have expertise in different areas—biology, psychology, neuroscience, communication, and geographic information science— united by our common goal.",
        "currentImpact": "Many NIH grants for health research have already been cancelled (formally terminated) or frozen (funds withheld without justification), interrupting ongoing studies and clinical trials. To track canceled and frozen grants, we use the <a href=\"https://grant-watch.us/nih-data.html\" target=\"_blank\"> Grant Watch database</a>, which is based on reports from government sources and researchers. Please note that changes to grants are ongoing, so data are subject to change. Grants that are restored or unfrozen are removed from our loss estimates. There can also be lags between when a grant is affected and when the change appears in the database.<br/><br/>For cancelled and frozen grants, we assume that losses are equivalent to the remaining grant funds that were not spent at the time of cancellation. Cancelled and frozen grants from adjacent divisions within the same institution (e.g., the main campus and medical school of the same university) are combined under one broader institution label (e.g., “Columbia University”).",
        "futureImpact": "One proposed change would greatly reduce NIH funding that covers <a href=\"https://grants.nih.gov/grants/guide/notice-files/NOT-OD-25-068.html\" target=\"_blank\">“indirect costs” of research</a>. Funding for indirect costs helps pay for essential facilities, equipment, skilled staff, and safety checks needed across many research projects. Medical research would not be possible without funding to cover indirect costs.<br/><br/>At many institutions, indirect costs are 40%-60% of the budget allocated to direct costs of research. The proposed changes would cap funding for indirect costs at 15%, taking back billions of dollars that were promised to the states. States have sued to challenge the order, arguing that the changes are unlawful. Currently, a federal judge has issued <a href=\"https://storage.courtlistener.com/recap/gov.uscourts.mad.280590/gov.uscourts.mad.280590.25.0.pdf\" target=\"_blank\">an injunction</a> to temporarily block the changes. To estimate decreases in funding, we calculate the difference between current funding for indirect costs and proposed funding with a 15% maximum for current NIH grants. We source our data from a <a target=\"_blank\" href=\"https://report.nih.gov/award/index.cfm\">public database of NIH grants</a> that were active in 2024.",
        "economicImpact": "For estimates of economic losses in communities, resulting from changes to funding for indirect costs as well as cancelled/frozen grants, we multiply direct loss values by 2.56. This multiplier is derived from <a target=\"_blank\" href=\"https://www.unitedformedicalresearch.org/wp-content/uploads/2025/03/UMR_NIH-Role-in-Sustaining-US-Economy-FY2024-2025-Update.pdf\">a recent report</a>, which found that every dollar invested in NIH generated $2.56 in new economic activity in 2024. To estimate the number of jobs that would be lost if NIH funding is cut, we used the ratio of the number of jobs supported / research funds awarded in the 2024 fiscal year. We also use <a target=\"_blank\" href=\"https://lehd.ces.census.gov/data/\">Census data on where U.S. commuters live and work</a> to estimate how economic activity generated in each county can spread to adjacent counties.<br/><br/>Note that cancelled and frozen grants do not count toward the estimates of future losses that would result from a 15% cap on indirect costs, to prevent double-counting. This means that estimates of total loss are not necessarily the sum of future and current losses.<br/><br/>Our approach is similar to that implemented in <a href=\"https://www.nytimes.com/interactive/2025/02/13/upshot/nih-trump-funding-cuts.html\" target=\"_blank\">The Upshot</a> and in policy analysis by higher education specialist, <a href=\"https://jamessmurphy.com/2025/02/09/the-impact-of-an-nih-15-indirect-cost-rate/\">James Murphy</a>. Both of these analyses focused on institution-specific and state-level impacts using similar approaches to estimate impacts of cuts to NIH-negotiated indirect cost rates on medical research. Our approach combines these methods with US census data and interactive visualizations to engage with impacts at county levels nationwide. Our data and code are <a href=\"http://doi.org/10.17605/OSF.IO/H398E\" target=\"_blank\">publicly available here</a>. Detailed methodology is described in a preprint available via <a href=\"https://www.medrxiv.org/content/10.1101/2025.07.24.25332092v1\" target=\"_blank\">medrxiv</a>, entitled ‘Economic Loss due to Health Funding Cuts as Distributed Across Geospatial Units’, released on July 24, 2025",
        "fy26Budget": "We compare the proposed NIH FY 2026 <a target=\"_blank\" href=\"https://officeofbudget.od.nih.gov/pdfs/FY26/br/Overview%20of%20FY%202026%20Supplementary%20Tables.pdf\">budget</a> to the FY2024 budget to estimate the proportion of funding lost. We calculate the inflation-adjusted five-year <a target=\"_blank\" href=\"https://reporter.nih.gov/\">average</a> of funding across active grants within a given Congressional District from FY2020-2024. We exclude FY2025 from the analysis because grant terminations and freezes have reduced fund distribution compared to historic levels. We exclude grant funding received from agencies outside of the NIH (e.g., FDA and CDC). We similarly calculate reductions in funding for three ICs that would be maintained under the proposed reorganization: the National Institute of Allergy and Infectious Diseases (NIAID), the National Cancer Institute, and the National Institute on Aging (NIA). We assume that cuts will be distributed evenly across regions and research topics",
        "sourceCode": "The code for this website is publicly available on <a href=\"https://github.com/clvcooke/scimap\" target=\"_blank\" rel=\"noopener noreferrer\">GitHub</a>. This repository contains the frontend React application, Python scripts for data processing, and Cloudflare serverless functions.",
        "contactUs": "For questions, comments, and press inquiries, please email <a href=\"mailto:contact@scienceimpacts.org\">contact@scienceimpacts.org</a>",
        "updates": "SCIMaP updates its data and visualization to reflect the current state of funding cuts. For the full data history you can reference the <a href=\"http://doi.org/10.17605/OSF.IO/H398E\"> publicly available data at the Open Science Framework link</a>.<br/><br/><b>To receive email updates about major website releases, reports, and publications, <a href=\"https://upenn.co1.qualtrics.com/jfe/form/SV_5vDEXlLWG9IyWmW\">please sign up here</a>.</b><br/><br/><b>March 27, 2025</b><br/>Initial release.<br/><br/><b>April 9th, 2025</b><br/>Congressional districts are now included in the map, and updates to state/county values have been made based on improved commuter flow data from the US census.<br/><br/><b>May 27, 2025</b><br/>Terminated NIH grants are now included on the map, displaying current local economic losses in the tooltip as well as blue bubbles listing the number and value of grants cancelled at each institution. Prior estimates for annual future losses, based on proposed changes to funding for indirect costs, have been renamed “future economic losses”.<br/><br/><b>June 22, 2025</b><br/>The effects of the proposed FY2026 budget are now included in a separate tab.<br/><br/><b>June 30, 2025</b><br/>Following an update to Grant Watch, we now track frozen grants in addition to cancelled grants under current losses.<br/><br/><b>August 14, 2025</b><br/>We have revamped our FY26 map to improve the display of values, and added per-district fact sheet that can be viewed by clicking on a district. This change also updates the map to use the 119th Congressional Districts.<br/><br/><b>September 15, 2025</b><br/>The Congressional District-level analysis has been updated to use boundaries from the 119th Congress (2025-2026) instead of the 118th Congress (2023-2024). This may lead to small changes in states that redistricted: North Carolina, Louisiana, Georgia, Alabama, and New York. We also now correct coordinates for a small number of organizations that we were previously unable to geolocate. This correction causes a small increase in estimated future losses."
    }, ['mission', 'team', 'currentImpact', 'futureImpact', 'economicImpact', 'fy26Budget', 'sourceCode', 'contactUs', 'updates'])

    # Learn More
    write_singleton('learnMore', {
        "title": "Understanding NIH Funding",
        "sections": [
            {
                "title": "What does the NIH do?",
                "content": "The <b>National Institutes of Health</b> (NIH) provides funding for crucial research that addresses <b>leading health problems</b>, including cancer, diabetes, dementia, heart disease, stroke, mental illness, and more.<br/><br/>Research funded by the NIH has led to <a href=\"https://www.nih.gov/about-nih/what-we-do/impact-nih-research\" target=\"_blank\">major breakthroughs</a> like prevention, treatment, and cures for heart disease, cancer, and type 1 diabetes."
            },
            {
                "title": "How does the NIH contribute to the U.S. economy?",
                "content": "NIH funding is an <b>excellent financial investment</b>. Less than 1% of the total federal budget goes to the NIH, but this small investment has a big impact. Every dollar invested in scientific research through NIH produces, on average, <b>$2.56</b> of economic activity in return—a gain of over <b>250%.</b><br/><br/>NIH funding supports universities, hospitals, research institutions, and businesses across the U.S. and globally. In 2024, the NIH directly supported nearly <b>half a million jobs</b> and generated <b>billions of dollars</b> in new economic activity in the U.S."
            },
            {
                "title": "What are the changes to NIH funding?",
                "content": "Currently, the White House has ordered <strong>major changes to NIH funding</strong>, which would <strong>take back funds</strong> that were already promised to the states. States have sued to challenge the order, arguing that the changes are <strong>unlawful</strong>.<br/><br/>There are two major sources of cuts to NIH funding, which will result in current and future losses. First, many NIH grants for health research have already been cancelled or frozen, interrupting ongoing studies and clinical trials.<br/><br/>Second, another change would greatly reduce NIH funding that covers <a target=\"_blank\" href=\"https://research.unc.edu/2025/02/13/true-costs-of-conducting-research/\"><strong>\"indirect costs\"</strong></a> of research. These funds indirectly support research by helping pay for essential facilities, special equipment, skilled staff, and safety checks that are shared across many research projects. Medical research is not possible without funding to cover indirect costs."
            },
            {
                "title": "What will happen due to NIH funding cuts?",
                "content": "Universities, hospitals, research institutes, and businesses that receive NIH grants would lose money that is crucial for research.<br/><br/>Across the nation, the proposed changes to federal funding for research are projected to cause a loss of <b>billions of dollars</b> for the U.S. economy.<br/><br/>The changes would also result in the loss of <b>tens of thousands</b> of jobs in the U.S.<br/><br/>Medical research would be slowed, making it harder to cure diseases and keep people healthy. Clinical trials will be disrupted, erasing opportunities for people to benefit from new cures. The U.S. could lose its standing as a world leader in medical research, science, and technology."
            },
            {
                "title": "What other cuts are being made to scientific research?",
                "content": "In addition to the current and proposed cuts to NIH grants displayed on the map, the White House has also proposed a 40% reduction in the NIH’s annual budget, which would further reduce funding for health research.<br/><br/>SCIMaP currently focuses on cuts to NIH funding, but similar cuts have been proposed at the <b> National Science Foundation</b> (NSF). Cuts include a proposal that would impose a 15% cap on indirect costs for grants from the National Science Foundation (NSF), and a proposal to reduce the NSF budget by 66%. NSF’s mission is to “promote the progress of science; to advance the national health, prosperity and welfare; and to secure the national defense.”<br/><br/>Other threats to research include cancellations of grants from other federal agencies, elimination of doctoral student training opportunities, and mass layoffs of scientists and staff working at NIH, CDC, and other health agencies. There are also widespread opportunity costs due to cancelled funding opportunities, disrupted review of grant proposals."
            }
        ]
    }, [], [], ['sections'])

    # Impact Statement
    write_singleton('impactStatement', {
        "modalTitle": "Medical Research is at Risk",
        "part1": "The <b>National Institutes of Health</b> (NIH) funds crucial health research to address cancer, diabetes, dementia, and more.<br/><br/>NIH funding also boosts the economy, returning &gt;250% of the value invested.<br/><br/>The White House has ordered major cuts to NIH funding nationwide, which would <b>take back funds</b> promised to the states.",
        "part2": "Many NIH grants for health research have been cancelled or frozen, interrupting ongoing studies and clinical trials <b>(current losses)</b>. The administration also ordered across-the-board cuts to NIH funding for \"indirect costs\" of research, which covers essential facilities, equipment, staff, and safety checks<b> (future losses)</b>.<br/><br/>This website shows the current and future <b>economic impact of funding cuts</b>.",
        "fy26Content": "The White House <b>FY 2026 budget proposal</b> substantially cuts NIH research funding. Budget cuts are projected to lead to &gt;$46B in lost economic activity in the upcoming year.<br/><br/>This website shows the economic impact of NIH budget cuts, cancelled grants, and reduced funding for research infrastructure.",
        "consentLabel": "We collect anonymous data from users for research purposes. Please check this box if you are 18+ years of age and agree to share anonymous data. (Not required to use the website)"
    }, ['part1', 'part2', 'fy26Content'])

    # Quiz
    write_singleton('quiz', {
        "overviewTitle": "How would <b>your state be impacted</b> by changes to NIH funding? <b>Take the quiz</b> to find out!",
        "overviewQuestion": "How much do you <b>approve</b> or <b>disapprove</b> of the <b>decreases</b> to federal funding for scientific research?",
        "cancelledGrantsText1": "The White House has ordered <b>major changes to NIH funding</b>, which would <b>take back funds</b> that were already promised to the states. States have sued to challenge the orders, arguing that the changes are <b>unlawful</b>. Universities, hospitals, and other institutions that receive NIH grants would <b>lose money that is crucial</b> for operating and conducting research.",
        "cancelledGrantsText2": "Many NIH grants for health research have been cancelled or frozen, interrupting ongoing studies and clinical trials. These cancelled grants will cause economic losses in your state.",
        "cancelledGrantsQuestion": "Can you guess how many <b>millions of dollars</b> will be lost due to cancelled and frozen grants in <b>{stateValue}</b>?",
        "indirectCostsText1": "Another change would greatly reduce NIH funding that covers <b>\"indirect costs\"</b> of research. These funds help pay for essential facilities, special equipment, skilled staff, and safety checks that are shared across many research projects.",
        "indirectCostsText2": "Cutting funding for indirect costs of research would cause ongoing economic losses in your state every year.",
        "indirectCostsQuestion": "Can you guess how many <b>millions of dollars</b> would be lost every year in <b>{stateValue}</b> if funding for indirect costs is cut?",
        "resultsText": "After learning about impact for your state, how much do you <b>approve or disapprove</b> of proposed changes to federal funding for scientific research?"
    }, ['overviewTitle', 'overviewQuestion', 'cancelledGrantsText1', 'cancelledGrantsText2', 'indirectCostsText1', 'indirectCostsText2', 'resultsText'])

    # News
    news_items = [
        { "title": "Stand Up for Science, \"Powered by SCIMaP\"", "date": "Ongoing", "url": "https://www.standupforscience.net/resources", "isOngoing": True },
        { "title": "PolitiFact", "date": "November 20th, 2025", "url": "https://www.politifact.com/factchecks/2025/nov/20/robert-f-kennedy-jr/medical-science-research-grant-funding-cuts-RFK/", "isOngoing": False }
    ]
    for item in news_items:
        slug = item['title'].lower().replace(' ', '-').replace('"', '').replace(',', '')
        os.makedirs(f'src/content/news/{slug}', exist_ok=True)
        with open(f'src/content/news/{slug}/index.json', 'w') as f:
            json.dump(item, f, indent=2)

if __name__ == '__main__':
    migrate()
