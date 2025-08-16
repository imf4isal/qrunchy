# Qrunchy Features Planning

## Food Court Feature Implementation Plan

### Customer Experience (Food Court QR Scan)

**Initial QR Scan:**
- Customer scans ONE food court QR code (`foodcourt_XXXXXXXX`)
- Lands on food court homepage showing:
  - Food court name & location
  - Grid view of all restaurants with logos/images
  - Global search bar at top
  - Each restaurant card shows: name, cuisine type, sample popular items

**Global Search Experience:**
- Search across ALL items/categories/restaurants in that food court
- Search "shake" → shows "Chocolate Shake - McDonald's - $3.99" with item image
- Results display: Item name + Restaurant name + Price + Item image + Restaurant category
- Clicking search result → navigates to that restaurant's menu with item highlighted/scrolled to that specific position
- Shows item images if available and restaurant cuisine type/category for better UX

**Restaurant Menu Navigation:**
- From food court homepage → click restaurant → view full menu (current menu viewer)
- Individual restaurant QR codes still work independently
- Seamless back navigation to food court homepage

### Food Court Owner Experience

**Food Court Registration (Simple Approach):**
1. "Register Food Court" button in dashboard
2. Master password validation + OTP to admin phone (one-time setup per food court)
3. Food court setup form: name, location, description
4. Search & select existing restaurants to include (search by restaurant name)
5. Generate food court QR code
6. Food court appears in new "Food Courts" tab in dashboard

**Food Court Management:**
- View/edit food court details
- Add/remove restaurants (search by restaurant name)
- Toggle food court active/inactive status
- View food court QR code & analytics
- Restaurants can belong to multiple food courts (keep flexible for future changes)
- Restaurant menus remain independent - food court QR is totally separate functionality

**Alternative Approach (Future Consideration):**
- Restaurant approval system: when adding restaurants not owned by food court admin, send notification to restaurant owner for approval
- Both direct addition (for owned restaurants) and approval system (for external restaurants)
- Note: Might be over-engineering initially, can be added later

## Technical Implementation Strategy

### Phase 1: Core Food Court Infrastructure
- New food court QR type: `foodcourt_XXXXXXXX`
- Food court to restaurant relationship tables
- Basic food court CRUD operations
- Master password authentication system
- Leverage existing `group_res` table with `foodcourt` type

### Phase 2: Customer-Facing Food Court Viewer
- Food court homepage component
- Restaurant grid layout
- Global search functionality with item highlighting and scroll-to-position
- Navigation between food court → restaurant menu
- Search results showing item + restaurant + price + images + categories

### Phase 3: Admin Dashboard Integration
- Food court registration flow with master password + OTP
- Food court management tab in dashboard
- Restaurant search & selection interface
- QR code generation for food courts
- Active/inactive toggle functionality

### Phase 4: Search & Performance Optimization
- Cross-restaurant search indexing for food court items
- Search result ranking & filtering
- Performance optimization for large food courts
- Item position highlighting in restaurant menus

## Future Global Search Feature (Out of Scope for Now)

**Vision:**
- Global page where customers can search restaurants/categories/items from home
- Browse menus before visiting restaurants
- Similar to food court search but across all restaurants in the platform
- Foundation being built with food court search functionality

## Database Schema Considerations

**Existing Structure to Leverage:**
- `group_res` table already has `foodcourt` type
- `restaurant` table has `group_res_id` for relationships
- Current QR code system can be extended for food court QRs

**New Requirements:**
- Food court specific QR code generation
- Search indexing across restaurant items within food court
- Master password authentication for food court registration

## Benefits of This Approach

1. **User Experience Priority:**
   - Seamless customer experience with global search
   - Item-level navigation with position highlighting
   - Maintains restaurant independence

2. **Technical Simplicity:**
   - Leverages existing restaurant/menu infrastructure
   - Simple admin experience with powerful customer features
   - Foundation for future global search functionality

3. **Business Flexibility:**
   - Restaurants can belong to multiple food courts
   - Independent restaurant operations maintained
   - Flexible architecture for future enhancements

4. **Scalability:**
   - Can handle large food courts with many restaurants
   - Search functionality can be extended to global platform search
   - Performance optimization points identified

## Implementation Notes

- Food court registration requires admin approval (master password + OTP)
- Restaurant selection by search (not list view for better UX)
- Global search limited to food court scope initially
- Item highlighting/scroll-to-position for better search result experience
- Restaurant independence maintained (individual QR codes still work)
- Food court QR codes are separate functionality from restaurant QRs

## Questions for Future Consideration

1. Should restaurants be able to belong to multiple food courts? (Current answer: Yes, keep flexible)
2. Restaurant approval system for external restaurants? (Future enhancement)
3. Analytics for food court performance? (Future feature)
4. Food court branding customization? (Future feature)
5. Integration with ordering system? (Out of current scope)