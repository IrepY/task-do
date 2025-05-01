import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";
import { useTranslation } from "react-i18next";
import { getDueDateColor } from "../hooks/dateFormatters"; // Import the shared function

function TaskItem({
  task,
  onDelete,
  onToggle,
  onTaskSelect,
  isDeleting,
  isDisabled,
  isMenuOpen,
}) {
  const effectiveDisabled = isDeleting || isDisabled;
  const isCompleted = task.completed;
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const [isTitleOverflowing, setIsTitleOverflowing] = useState(false);
  const [isDescriptionOverflowing, setIsDescriptionOverflowing] = useState(
    false
  );

  const checkOverflow = () => {
    const titleElement = titleRef.current;
    if (titleElement) {
      void titleElement.offsetWidth;
      const titleOverflows = titleElement.scrollWidth > titleElement.clientWidth;
      setIsTitleOverflowing(titleOverflows);
    }

    const descElement = descriptionRef.current;
    if (descElement && task.description) {
      void descElement.offsetWidth;
      const descOverflows = descElement.scrollWidth > descElement.clientWidth;
      setIsDescriptionOverflowing(descOverflows);
    }
  };

  useEffect(() => {
    checkOverflow();

    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [task.title, task.description]);

  useEffect(() => {
    const timeoutIds = [50, 150, 300, 500].map((delay) =>
      setTimeout(() => {
        checkOverflow();
      }, delay)
    );

    return () => timeoutIds.forEach((id) => clearTimeout(id));
  }, [isMenuOpen]);

  const textBaseClass =
    "block max-w-full whitespace-nowrap overflow-hidden relative";

  const isClickable = !effectiveDisabled;

  const gradientEndColor = document.documentElement.classList.contains("dark")
    ? isCompleted
      ? "rgba(31, 41, 55, 0)"
      : "rgba(17, 24, 39, 0)"
    : isCompleted
    ? "rgba(240, 253, 244, 0)"
    : "rgba(255, 255, 255, 0)";

  const gradientStartColor = document.documentElement.classList.contains("dark")
    ? isCompleted
      ? "#1f2937"
      : "#111827"
    : isCompleted
    ? "#f0fdf4"
    : "#ffffff";

  const dueDateColor = getDueDateColor(task.due_date)

  return (
    <div
      className={`rounded-2xl shadow-lg px-6 mb-4 ${
        task.description ? "py-5" : "py-2"
      } flex gap-4 border-2 transition-all duration-200 ${
        isCompleted
          ? "bg-green-50 dark:bg-gray-800 border-green-200 dark:border-gray-700 text-gray-400 dark:text-gray-500"
          : "bg-white dark:bg-gray-900 border-indigo-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500"
      } ${isDeleting ? "animate-fadeOutThenShrink overflow-hidden origin-top" : ""} ${
        isDisabled && !isDeleting ? "opacity-70 cursor-not-allowed" : ""
      } ${isClickable ? "cursor-pointer" : ""}`}
      onClick={() => isClickable && onTaskSelect(task.id)}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isClickable ? `View task ${task.title}` : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onTaskSelect(task.id);
        }
      }}
    >
      <div
        className={`flex-1 min-w-0 flex items-center`}
        style={{ minHeight: "56px" }}
      >
        <div
          className={`w-full ${!task.description ? "flex flex-col justify-center" : ""}`}
        >
          <div className="flex items-center gap-2 min-w-0 relative">
            <span
              ref={titleRef}
              className={`text-lg font-semibold ${
                isCompleted
                  ? "text-gray-500 dark:text-gray-400"
                  : "text-indigo-800 dark:text-indigo-200"
              } ${textBaseClass}`}
            >
              {task.title}
              {isTitleOverflowing && (
                <span
                  className="absolute right-0 top-0 h-full w-16 pointer-events-none"
                  style={{
                    background: `linear-gradient(to right, ${gradientEndColor}, ${gradientStartColor})`,
                  }}
                />
              )}
            </span>
          </div>
          {task.description && (
            <div className="relative">
              <p
                ref={descriptionRef}
                className={`text-sm ${
                  isCompleted
                    ? "text-gray-400 dark:text-gray-500"
                    : "text-gray-600 dark:text-gray-400"
                } mt-1 ${textBaseClass}`}
              >
                {task.description}
                {isDescriptionOverflowing && (
                  <span
                    className="absolute right-0 top-0 h-full w-16 pointer-events-none"
                    style={{
                      background: `linear-gradient(to right, ${gradientEndColor}, ${gradientStartColor})`,
                    }}
                  />
                )}
              </p>
            </div>
          )}
          {task.due_date && (
            <div className="mt-1 animate-fadeIn">
              <span className={`text-xs font-medium ${dueDateColor}`}>
                {task.due_date}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-center min-h-full items-center">
        <div className="flex flex-row items-center gap-2">
          {!isCompleted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                !effectiveDisabled && onToggle(task.id, true);
              }}
              className={`bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-700 w-12 h-10 rounded font-semibold text-xl transition-all duration-300 flex items-center justify-center ${
                effectiveDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={effectiveDisabled}
              aria-label={`Mark task ${task.title} as complete`}
            >
              ✓
            </button>
          )}
          {isCompleted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                !effectiveDisabled && onToggle(task.id, false);
              }}
              className={`bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 w-12 h-10 rounded font-semibold text-xl transition-all duration-300 flex items-center justify-center ${
                effectiveDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={effectiveDisabled}
              aria-label={`Mark task ${task.title} as incomplete`}
            >
              ↩
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              !effectiveDisabled && onDelete(task.id);
            }}
            className={`bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-700 w-12 h-10 rounded font-semibold text-2xl transition flex items-center justify-center leading-none ${
              effectiveDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            style={{ fontFamily: "monospace", fontWeight: 700 }}
            disabled={effectiveDisabled}
            aria-label={`Delete task ${task.title}`}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

TaskItem.propTypes = {
  task: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  onTaskSelect: PropTypes.func.isRequired,
  isDeleting: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isMenuOpen: PropTypes.bool,
};

export default TaskItem;
