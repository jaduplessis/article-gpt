from functions.willV2.llm import WillV2
import json

will = WillV2()

def main(draft_file: str, versions: int, verbose: bool = True):
    sections = draft_file.split("\n\n")
    sections = [sections[2]]

    def generate_version(section, index):
        responses = {}
        for i in range(versions):
            if verbose:
                print(f"Version {i+1}/{versions}", end="\r")
            
            response = will.invoke_ft(section)
            responses[i] = response

        with open(f"data/output/responses_{index}.json", "w", encoding="utf-8") as file:
            json.dump(responses, file, indent=4)


    for index, section in enumerate(sections):
        if verbose:
            print(f"Section {index+1}/{len(sections)}")
        generate_version(section, index)
