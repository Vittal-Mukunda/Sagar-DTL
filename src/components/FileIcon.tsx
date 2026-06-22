import {
  FileText,
  FileSpreadsheet,
  FileImage,
  Presentation,
  FileArchive,
  FileVideo,
  File,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  txt: FileText,
  md: FileText,
  csv: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  xls: FileSpreadsheet,
  ppt: Presentation,
  pptx: Presentation,
  png: FileImage,
  jpg: FileImage,
  jpeg: FileImage,
  gif: FileImage,
  webp: FileImage,
  svg: FileImage,
  zip: FileArchive,
  rar: FileArchive,
  mp4: FileVideo,
  mov: FileVideo,
};

export function FileIcon({
  ext,
  className = "h-6 w-6",
}: {
  ext: string;
  className?: string;
}) {
  const Icon = MAP[ext] ?? File;
  return <Icon className={className} strokeWidth={2} />;
}
