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
    <div className="flex flex-wrap gap-4 bg-card p-4 rounded-lg border">
      <Input
        placeholder="Search by title or location..."
        value={table.getColumn("title")?.getFilterValue() ?? ""}
        onChange={(event) =>
          table.getColumn("title")?.setFilterValue(event.target.value)
        }
        className="flex-1 min-w-[200px] focus-visible:ring-2 focus-visible:ring-red-500"
      />

      <Select
        value={table.getColumn("status")?.getFilterValue() ?? "all"}
        onValueChange={(value) =>
          table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="min-w-[150px]">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="responding">Responding</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={table.getColumn("severity")?.getFilterValue() ?? "all"}
        onValueChange={(value) =>
          table.getColumn("severity")?.setFilterValue(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="min-w-[150px]">
          <SelectValue placeholder="All Severity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Severity</SelectItem>
          <SelectItem value="critical">Critical</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={table.getColumn("alert_type")?.getFilterValue() ?? "all"}
        onValueChange={(value) =>
          table.getColumn("alert_type")?.setFilterValue(value === "all" ? "" : value)
        }
      >
        <SelectTrigger className="min-w-[150px]">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="medical">Medical</SelectItem>
          <SelectItem value="fire">Fire</SelectItem>
          <SelectItem value="accident">Accident</SelectItem>
          <SelectItem value="crime">Crime</SelectItem>
          <SelectItem value="natural_disaster">Natural Disaster</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
