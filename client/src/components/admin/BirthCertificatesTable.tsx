import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Printer } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface BirthCertificate {
  id: string;
  trackingNumber: string;
  childNameEn: string;
  dateOfBirth: string;
  placeOfBirthEn: string;
  fatherNameEn: string;
  motherNameEn: string;
  permanentAddressEn: string;
  motherAadhar: string;
  status: string;
  createdAt: string;
}

export default function BirthCertificatesTable() {
  const [certificates, setCertificates] = useState<BirthCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BirthCertificate | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/birth-certificates');
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
      const response = await fetch(`/api/admin/birth-certificates/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          childNameEn: editing.childNameEn,
          dateOfBirth: editing.dateOfBirth,
          placeOfBirthEn: editing.placeOfBirthEn,
          fatherNameEn: editing.fatherNameEn,
          motherNameEn: editing.motherNameEn,
          permanentAddressEn: editing.permanentAddressEn,
          motherAadhar: editing.motherAadhar,
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
      await fetch(`/api/admin/birth-certificates/${id}`, { method: 'DELETE' });
      await fetchData();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await fetch(`/api/birth-certificates/${id}/status`, {
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
    window.open(`/birth-certificate/print/${id}`, '_blank');
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking #</TableHead>
              <TableHead>Child Name</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>Father</TableHead>
              <TableHead>Mother</TableHead>
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
                  <TableCell>{cert.childNameEn}</TableCell>
                  <TableCell>{cert.dateOfBirth}</TableCell>
                  <TableCell>{cert.fatherNameEn}</TableCell>
                  <TableCell>{cert.motherNameEn}</TableCell>
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
            <DialogTitle>Edit Birth Certificate</DialogTitle>
            <DialogDescription>Update certificate details</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div><Label>Child Name</Label><Input value={editing.childNameEn} onChange={(e) => setEditing({ ...editing, childNameEn: e.target.value })} /></div>
              <div><Label>Date of Birth</Label><Input type="date" value={editing.dateOfBirth} onChange={(e) => setEditing({ ...editing, dateOfBirth: e.target.value })} /></div>
              <div><Label>Place of Birth</Label><Input value={editing.placeOfBirthEn} onChange={(e) => setEditing({ ...editing, placeOfBirthEn: e.target.value })} /></div>
              <div><Label>Father Name</Label><Input value={editing.fatherNameEn} onChange={(e) => setEditing({ ...editing, fatherNameEn: e.target.value })} /></div>
              <div><Label>Mother Name</Label><Input value={editing.motherNameEn} onChange={(e) => setEditing({ ...editing, motherNameEn: e.target.value })} /></div>
              <div><Label>Address</Label><Input value={editing.permanentAddressEn} onChange={(e) => setEditing({ ...editing, permanentAddressEn: e.target.value })} /></div>
              <div><Label>Mother Aadhar</Label><Input value={editing.motherAadhar} onChange={(e) => setEditing({ ...editing, motherAadhar: e.target.value })} /></div>
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
