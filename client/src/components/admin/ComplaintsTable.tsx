import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Complaint {
  id: string;
  trackingNumber: string;
  name: string;
  nameMr?: string;
  contact: string;
  address: string;
  addressMr?: string;
  category: string;
  categoryMr?: string;
  description: string;
  descriptionMr?: string;
  images?: string[];
  adminRemark?: string;
  status: string;
  createdAt: string;
}

export default function ComplaintsTable() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('/api/complaints');
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (complaint: Complaint) => {
    setEditingComplaint(complaint);
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingComplaint) return;

    try {
      const response = await fetch(`/api/admin/complaints/${editingComplaint.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingComplaint.name,
          contact: editingComplaint.contact,
          address: editingComplaint.address,
          category: editingComplaint.category,
          description: editingComplaint.description,
        }),
      });

      if (response.ok) {
        await fetchComplaints();
        setEditDialogOpen(false);
        setEditingComplaint(null);
      }
    } catch (error) {
      console.error('Failed to update complaint:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/complaints/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchComplaints();
      }
    } catch (error) {
      console.error('Failed to delete complaint:', error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await fetchComplaints();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      'in-progress': "default",
      resolved: "outline",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  if (loading) {
    return <div className="text-center py-8">Loading complaints...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking #</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No complaints found
                </TableCell>
              </TableRow>
            ) : (
              complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-mono text-sm">{complaint.trackingNumber}</TableCell>
                  <TableCell>{complaint.name}</TableCell>
                  <TableCell>{complaint.contact}</TableCell>
                  <TableCell className="capitalize">{complaint.category}</TableCell>
                  <TableCell>
                    <Select
                      value={complaint.status}
                      onValueChange={(value) => handleStatusChange(complaint.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(complaint)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Complaint</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this complaint? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(complaint.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Complaint</DialogTitle>
            <DialogDescription>
              Make changes to the complaint details
            </DialogDescription>
          </DialogHeader>
          {editingComplaint && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={editingComplaint.name}
                  onChange={(e) => setEditingComplaint({ ...editingComplaint, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Contact</Label>
                <Input
                  value={editingComplaint.contact}
                  onChange={(e) => setEditingComplaint({ ...editingComplaint, contact: e.target.value })}
                />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  value={editingComplaint.address}
                  onChange={(e) => setEditingComplaint({ ...editingComplaint, address: e.target.value })}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={editingComplaint.category}
                  onValueChange={(value) => setEditingComplaint({ ...editingComplaint, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="water">Water Supply</SelectItem>
                    <SelectItem value="electricity">Electricity</SelectItem>
                    <SelectItem value="roads">Roads</SelectItem>
                    <SelectItem value="drainage">Drainage</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editingComplaint.description}
                  onChange={(e) => setEditingComplaint({ ...editingComplaint, description: e.target.value })}
                  rows={5}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
