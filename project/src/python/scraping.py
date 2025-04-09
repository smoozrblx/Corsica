from bs4 import BeautifulSoup
import requests
import csv
import re

def charge_tableaux(url):
    try:
        reponse = requests.get(url)
        reponse.raise_for_status()
        return BeautifulSoup(reponse.text, "html.parser").find_all('table')
    except Exception as e:
        print(f"Erreur lors du chargement de la page : {str(e)}")
        return []

def code_commune(tab):
    for tr in tab.find_all('tr'):
        ths = tr.find_all('th')
        tds = tr.find_all('td')
        if ths and ths[0].text.strip() == "Code commune" and tds:
            code = tds[0].text.strip()
            return code if code.startswith('2B') else '99999'
    return "99999"

def coordonnee_gps(tab):
    for tr in tab.find_all('tr'):
        ths = tr.find_all('th')
        if ths and 'Coordonnées' in ths[0].text:
            liens = tr.find_all('a', {'class': 'mw-kartographer-maplink'})
            if liens:
                return [float(liens[0]['data-lat']), float(liens[0]['data-lon'])]
    return [42.15, 9.08]  # Coordonnées par défaut en Corse

def main():
    url = "https://fr.wikipedia.org/wiki/Liste_des_anciennes_communes_de_la_Haute-Corse"
    tables = charge_tableaux(url)
    
    if len(tables) < 3:
        print("Structure de page inattendue! Vérifiez le format des tables Wikipédia.")
        return

    table_modification_nom = tables[0]
    table_fusions = tables[1]
    table_creation_retablissement = tables[2]

    communes = {}
    fusions = {}
    creations = {}
    modifications = {}

    # Traitement des fusions
    for idx, ligne in enumerate(table_fusions.find_all('tr')[1:]):
        cells = ligne.find_all('td')
        if len(cells) < 2: continue

        try:
            nouvelle_commune = cells[0].text.strip()
            anciennes_communes = [a.text.strip() for a in cells[1].find_all('a')]
            date_match = re.search(r'\d{4}', cells[-1].text)
            date = int(date_match.group()) if date_match else 1600

            lien = cells[0].find('a')
            code = '99999'
            coord = [42.15, 9.08]
            if lien:
                url_commune = f"https://fr.wikipedia.org{lien['href']}"
                soup_commune = charge_tableaux(url_commune)
                if soup_commune:
                    code = code_commune(soup_commune[0])
                    coord = coordonnee_gps(soup_commune[0])

            communes[code] = [code, nouvelle_commune, date, None, coord]
            fusions[nouvelle_commune] = {
                'code': code,
                'communes': anciennes_communes,
                'date': date
            }

        except Exception as e:
            print(f"Erreur ligne fusion {idx+1} : {str(e)}")
            continue

    # Écriture des fichiers
    with open('communes.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Code_INSEE', 'Nom', 'Creation', 'Suppression', 'Latitude', 'Longitude'])
        for data in communes.values():
            if isinstance(data[4], list):
                writer.writerow([data[0], data[1], data[2], data[3], data[4][0], data[4][1]])
            else:
                writer.writerow(data)

if __name__ == "__main__":
    main()