//an Entity/Model (thing/structure of what you will store in a DB -- template for your db)

using System.ComponentModel.DataAnnotations;

namespace Domain // folder name
{
    public class Activity
    {
        public Guid Id { get; set; } //primary key of the database for Entity Framework to recog. as a global unique id
        
        // [Required] // data annotation to require a field (not the est approach!)
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
    }
}