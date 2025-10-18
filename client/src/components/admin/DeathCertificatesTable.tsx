import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Printer } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface DeathCertificate {
  id: string;
  trackingNumber: string;
  deceasedName: string;
  dateOfDeath: string;
  placeOfDeath: string;
  age: string;
  causeOfDeath: string;
  applicantName: string;
  relation: string;
  contact: string;
  address: string;
  status: string;
  createdAt: string;
}

export default function DeathCertificatesTable() {
  const [certificates, setCertificates] = useState<DeathCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<DeathCertificate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/death-certificates');
      const data = await response.json();
      setCertificates(data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      const response = await fetch(`/api/admin/death-certificates/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deceasedName: editing.deceasedName,
          dateOfDeath: editing.dateOfDeath,
          placeOfDeath: editing.placeOfDeath,
          age: editing.age,
          causeOfDeath: editing.causeOfDeath,
          applicantName: editing.applicantName,
          relation: editing.relation,
          contact: editing.contact,
          address: editing.address,
        }),
      });
      if (response.ok) {
        await fetchData();
        setDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/death-certificates/${id}`, { method: 'DELETE' });
      await fetchData();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await fetch(`/api/death-certificates/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await fetchData();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handlePrint = (id: string) => {
    window.open(`/death-certificate/print/${id}`, '_blank');
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking #</TableHead>
              <TableHead>Deceased Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Applicant</TableHead>
              <TableHead>Relation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              certificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-mono text-sm">{cert.trackingNumber}</TableCell>
                  <TableCell>{cert.deceasedName}</TableCell>
                  <TableCell>{cert.dateOfDeath}</TableCell>
                  <TableCell>{cert.applicantName}</TableCell>
                  <TableCell>{cert.relation}</TableCell>
                  <TableCell>
                    <Select value={cert.status} onValueChange={(v) => handleStatusChange(cert.id, v)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => handlePrint(cert.id)}
                        title="Print Certificate"
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { setEditing(cert); setDialogOpen(true); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm"><Trash2 className="w-4 h-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Record</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(cert.id)}>Delete</AlertDialogAction>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Death Certificate</DialogTitle>
            <DialogDescription>Update certificate details</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>Deceased Name</Label><Input value={editing.deceasedName} onChange={(e) => setEditing({ ...editing, deceasedName: e.target.value })} /></div>
              <div><Label>Date of Death</Label><Input type="date" value={editing.dateOfDeath} onChange={(e) => setEditing({ ...editing, dateOfDeath: e.target.value })} /></div>
              <div><Label>Place of Death</Label><Input value={editing.placeOfDeath} onChange={(e) => setEditing({ ...editing, placeOfDeath: e.target.value })} /></div>
              <div><Label>Age</Label><Input value={editing.age} onChange={(e) => setEditing({ ...editing, age: e.target.value })} /></div>
              <div><Label>Cause of Death</Label><Input value={editing.causeOfDeath} onChange={(e) => setEditing({ ...editing, causeOfDeath: e.target.value })} /></div>
              <div><Label>Applicant Name</Label><Input value={editing.applicantName} onChange={(e) => setEditing({ ...editing, applicantName: e.target.value })} /></div>
              <div><Label>Relation</Label><Input value={editing.relation} onChange={(e) => setEditing({ ...editing, relation: e.target.value })} /></div>
              <div><Label>Contact</Label><Input value={editing.contact} onChange={(e) => setEditing({ ...editing, contact: e.target.value })} /></div>
              <div><Label>Address</Label><Input value={editing.address} onChange={(e) => setEditing({ ...editing, address: e.target.value })} /></div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
