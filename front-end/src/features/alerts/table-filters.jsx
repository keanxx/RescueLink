import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TableFilters({ table }) {
  return (
    <div className="flex items-center gap-4 bg-card p-4 rounded-lg border">
      <Input
        placeholder="Search alerts..."
        value={table.getColumn("user")?.getFilterValue() ?? ""}
        onChange={(event) =>
          table.getColumn("user")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />

      <Select
        value={table.getColumn("status")?.getFilterValue() ?? "all"}
        onValueChange={(value) =>
          table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Status</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Verified">Verified</SelectItem>
          <SelectItem value="Resolved">Resolved</SelectItem>
        </SelectContent>
      </Select>

       <Select
        value={table.getColumn("severity")?.getFilterValue() ?? "all"}
        onValueChange={(value) =>
          table.getColumn("severity")?.setFilterValue(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Severity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Severity</SelectItem>
          <SelectItem value="Critical">Critical</SelectItem>
          <SelectItem value="High">High</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
