def generate_json_schema(json_object, depth=0, max_depth=1) -> dict:
    """
    Generate a JSON schema for the top-level (and second level if depth is less than max_depth) attributes of a JSON object.

    :param json_object: A JSON object to generate the schema for.
    :param depth: Current depth level (used for recursive calls).
    :param max_depth: Maximum depth level for which to generate the schema.
    :return: A dictionary representing the JSON schema of the object.
    """
    schema = {"type": "object", "properties": {}}

    if isinstance(json_object, dict):
        for key, value in json_object.items():
            # Determine the type of each attribute
            value_type = type(value).__name__
            if value_type == 'dict' and depth < max_depth:
                schema["properties"][key] = generate_json_schema(value, depth + 1, max_depth)
            elif value_type == 'list' and depth < max_depth and value and isinstance(value[0], dict):
                schema["properties"][key] = {
                    "type": "array",
                    "items": generate_json_schema(value[0], depth + 1, max_depth)
                }
            else:
                # If the type is a dict or list, indicate as a nested structure
                if isinstance(value, dict):
                    schema["properties"][key] = {"type": "object"}
                elif isinstance(value, list):
                    schema["properties"][key] = {"type": "array"}
                else:
                    schema["properties"][key] = {"type": value_type.lower()}

    return schema
