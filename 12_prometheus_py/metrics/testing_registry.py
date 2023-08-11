from prometheus_client import REGISTRY
from typing import List, Dict
from metrics.metrics import (
    task_processing_status_enum,
    task_steps_processing_histogram,
    task_enum_status,
    files_running_status_enum,
    file_step_processing_histogram
)

class PrometheusRegistry:

    @staticmethod
    def get_task_running_status(common_labels: Dict[str, str]):
        return PrometheusRegistry._get_enum_state(
            task_processing_status_enum._name, common_labels, task_enum_status
        )

    @staticmethod
    def get_file_running_status(file_enum_labels: Dict[str, str]):
        return PrometheusRegistry._get_enum_state(
            files_running_status_enum._name, file_enum_labels, task_enum_status
        )

    @staticmethod
    def get_task_step_processing_histogram_count(common_labels: Dict[str, str], status):
        return PrometheusRegistry._get_metric_count(
            task_steps_processing_histogram._name, dict(**common_labels, status=status)
        ) or 0

    @staticmethod
    def get_file_step_processing_histogram_count(file_labels: Dict[str, str], status):
        return PrometheusRegistry._get_metric_count(
            file_step_processing_histogram._name, dict(**file_labels, status=status)
        ) or 0

    @staticmethod
    def _get_enum_state(enum_name: str, labels: Dict[str, str], possible_states: List[str]):
        for state in possible_states:
            labels_with_state = labels.copy()
            labels_with_state[enum_name] = state
            if REGISTRY.get_sample_value(enum_name, labels=labels_with_state) == 1:
                return state

    @staticmethod
    def _get_metric_count(metric_name: str, labels: Dict[str, str]):
        return REGISTRY.get_sample_value(f"{metric_name}_count", labels=labels)
