from pydantic import BaseModel


class CommonLabels(BaseModel):
    trace_id: str = ""
    source_app: str = ""
    vendor: str = ""
    service: str = ""


class FileSpecificLabels(BaseModel):
    file_name: str
    origin_file_name: str
