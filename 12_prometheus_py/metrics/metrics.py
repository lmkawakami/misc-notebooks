from prometheus_client import Enum, Histogram
from metrics.labels_models import CommonLabels, FileSpecificLabels
from metrics.batch_running_status_enum import BatchRunningStatus

task_enum_labels = list(CommonLabels.__fields__.keys())
task_enum_states = [status.value for status in BatchRunningStatus]
task_histogram_labels = task_enum_labels + ["status"]

task_processing_status_enum = Enum(
    "batch_task_running_status",
    "enum with the current running status of the batch process task",
    task_enum_labels,
    states=task_enum_states,
)
task_steps_processing_histogram = Histogram(
    "batch_step_processing_histogram",
    "histogram with times of each processing step",
    task_histogram_labels,
)

file_enum_labels = list(CommonLabels.__fields__.keys()) + list(FileSpecificLabels.__fields__.keys())
file_enum_states = [status.value for status in BatchRunningStatus]
file_histogram_labels = file_enum_labels + ["status"]


files_running_status_enum = Enum(
    'batch_file_running_status',
    'enum with the current running status of each file',
    file_enum_labels,
    states=file_enum_states,
)
file_step_processing_histogram = Histogram(
    "file_step_processing_histogram",
    "histogram with processing times of the each file divided by step",
    file_histogram_labels,
)