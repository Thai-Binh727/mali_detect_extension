from Environment.path import safe_sites, safe_tlds
from Extract_features.ExtractFeatures_NamLe import getTLD


def Check_site(url):
    for site in safe_sites:
        if url.startswith(site):
            return True
    return False

def Check_tld(url):
    tld = getTLD(url)
    if tld in safe_tlds:
        return True
    return False

if __name__ == '__main__':
    url = 'https://moodle.usth.edu.vn/'
    print(Check_site(url))
    print(Check_tld(url))