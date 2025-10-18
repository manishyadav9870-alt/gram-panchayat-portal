import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Announcement {
  id: string;
  title: string;
  titleMr: string;
  description: string;
  descriptionMr: string;
  category: string;
  priority: string;
  date: string;
  createdAt: string;
}

export default function AnnouncementsTable() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/announcements');
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditing({
      id: '',
      title: '',
      titleMr: '',
      description: '',
      descriptionMr: '',
      category: 'general',
      priority: 'normal',
      date: new Date().toISOString().split('T')[0],
      createdAt: '',
    });
    setIsCreating(true);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    try {
      const url = isCreating ? '/api/announcements' : `/api/announcements/${editing.id}`;
      const method = isCreating ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editing.title,
          titleMr: editing.titleMr,
          description: editing.description,
          descriptionMr: editing.descriptionMr,
          category: editing.category,
          priority: editing.priority,
          date: editing.date,
        }),
      });
      
      if (response.ok) {
        await fetchData();
        setDialogOpen(false);
        setIsCreating(false);
      }
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      await fetchData();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Announcement
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No announcements found
                </TableCell>
              </TableRow>
            ) : (
              announcements.map((ann) => (
                <TableRow key={ann.id}>
                  <TableCell>{ann.title}</TableCell>
                  <TableCell className="capitalize">{ann.category}</TableCell>
                  <TableCell className="capitalize">{ann.priority}</TableCell>
                  <TableCell>{ann.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setEditing(ann); setIsCreating(false); setDialogOpen(true); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm"><Trash2 className="w-4 h-4" /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(ann.id)}>Delete</AlertDialogAction>
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
            <DialogTitle>{isCreating ? 'Create' : 'Edit'} Announcement</DialogTitle>
            <DialogDescription>Fill in announcement details</DialogDescription>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Title (English)</Label>
                <Input 
                  value={editing.title} 
                  onChange={async (e) => {
                    const englishValue = e.target.value;
                    setEditing({ ...editing, title: englishValue });
                    
                    // Auto-transliterate to Marathi
                    if (englishValue) {
                      try {
                        const response = await fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(englishValue)}&itc=mr-t-i0-und&num=1`);
                        const data = await response.json();
                        if (data[1] && data[1][0] && data[1][0][1] && data[1][0][1][0]) {
                          setEditing(prev => ({ ...prev!, titleMr: data[1][0][1][0] }));
                        }
                      } catch (error) {
                        console.error('Transliteration failed:', error);
                      }
                    }
                  }} 
                />
              </div>
              <div>
                <Label>Title (Marathi)</Label>
                <Input 
                  value={editing.titleMr} 
                  onChange={(e) => setEditing({ ...editing, titleMr: e.target.value })}
                  className="bg-green-50 border-green-300"
                />
              </div>
              <div>
                <Label>Description (English)</Label>
                <Textarea 
                  value={editing.description} 
                  onChange={async (e) => {
                    const englishValue = e.target.value;
                    setEditing({ ...editing, description: englishValue });
                    
                    // Auto-transliterate to Marathi
                    if (englishValue) {
                      try {
                        const response = await fetch(`https://inputtools.google.com/request?text=${encodeURIComponent(englishValue)}&itc=mr-t-i0-und&num=1`);
                        const data = await response.json();
                        if (data[1] && data[1][0] && data[1][0][1] && data[1][0][1][0]) {
                          setEditing(prev => ({ ...prev!, descriptionMr: data[1][0][1][0] }));
                        }
                      } catch (error) {
                        console.error('Transliteration failed:', error);
                      }
                    }
                  }} 
                  rows={3} 
                />
              </div>
              <div>
                <Label>Description (Marathi)</Label>
                <Textarea 
                  value={editing.descriptionMr} 
                  onChange={(e) => setEditing({ ...editing, descriptionMr: e.target.value })} 
                  rows={3}
                  className="bg-green-50 border-green-300"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={editing.category} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="holiday">Holiday</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={editing.priority} onValueChange={(v) => setEditing({ ...editing, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Date</Label><Input type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} /></div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setDialogOpen(false); setIsCreating(false); }}>Cancel</Button>
                <Button onClick={handleSave}>{isCreating ? 'Create' : 'Save Changes'}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
