import {
  BookOpen,
  Briefcase,
  FlaskConical,
  GraduationCap,
  Users,
  FileText,
  type LucideIcon,
} from "lucide-react";
import type { Accent } from "./theme";

/**
 * Section registry — the SINGLE place that maps a source folder to a page.
 * The CONTENTS of each folder are always rendered dynamically from the manifest,
 * so adding files/subfolders never requires editing this file. You'd only touch
 * this to add a brand-new top-level section with a custom title/icon/colour.
 */
export interface SectionConfig {
  /** Route slug, e.g. "study" -> /study */
  id: string;
  /** Full page title. */
  title: string;
  /** Short nav label. */
  nav: string;
  /** Source folder name as it appears in the manifest roots. */
  folder: string;
  accent: Accent;
  icon: LucideIcon;
  /** One-line description shown on cards / page headers. */
  description: string;
  /**
   * Render hint: "files" = folder browser, "table" = prefer CSV tables.
   * Pages handle both regardless; this only sets the default emphasis.
   */
  kind: "files" | "table";
}

export const SECTIONS: SectionConfig[] = [
  {
    id: "study",
    title: "Study Material & PYQP",
    nav: "Study Material",
    folder: "Notes and Papers",
    accent: "blue",
    icon: BookOpen,
    description:
      "Subject notes, assignments and previous-year question papers across all semesters.",
    kind: "files",
  },
  {
    id: "placements",
    title: "Placement Opportunities",
    nav: "Placements",
    folder: "Placement Data",
    accent: "red",
    icon: Briefcase,
    description:
      "Open roles, company drives, eligibility and packages. Add an opportunities.csv to get a live table.",
    kind: "table",
  },
  {
    id: "students",
    title: "Student Directory & EL List",
    nav: "Students",
    folder: "Students",
    accent: "yellow",
    icon: Users,
    description:
      "Searchable directory of students with contact details and Experiential Learning topics.",
    kind: "table",
  },
  {
    id: "projects",
    title: "Student Projects",
    nav: "Projects",
    folder: "Student Project",
    accent: "blue",
    icon: FlaskConical,
    description:
      "Reports, presentations and demos from student project work.",
    kind: "files",
  },
  {
    id: "alumni",
    title: "Alumni & Seniors",
    nav: "Alumni",
    folder: "Alumni Contacts",
    accent: "red",
    icon: GraduationCap,
    description:
      "Seniors and alumni, the companies they work in, and how to reach them.",
    kind: "table",
  },
];

/** Fallback icon for auto-discovered folders with no configured section. */
export const DEFAULT_ICON: LucideIcon = FileText;

export const getSection = (id: string) => SECTIONS.find((s) => s.id === id);
