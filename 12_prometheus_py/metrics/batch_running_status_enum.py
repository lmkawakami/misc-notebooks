from enum import Enum


class BatchRunningStatus(Enum):
    IDLE: str = "idle"
    DOWNLOADING: str = "downloading"
    TRANSFERRING: str = "transferring"
    UNZIPPING: str = "unzipping"
    CONVERTING: str = "converting"
    FAILED: str = "failed"
